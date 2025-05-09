<script module lang="ts">
    export const STATE_MACHINE_STATES = {
        DISCONNECTED: 'DISCONNECTED', // TODO: exit out of this state
        CONNECTING_TO_SERVER: 'CONNECTING_TO_SERVER',
        SERVER_CONNECTION_ERROR: 'SERVER_CONNECTION_ERROR',
        INCOMING_CALL: 'INCOMING_CALL',
        IDLE: 'IDLE',
        CALLING: 'CALLING',
        IN_CALL: 'IN_CALL',
        POST_CALL: 'POST_CALL'
    } as const;

    export type STATE_MACHINE_STATE = keyof typeof STATE_MACHINE_STATES;
</script>

<script lang="ts">
    import {
        mdiAccountCircle,
        mdiAlertCircle,
        mdiRefresh,
        mdiMicrophoneOff,
        mdiPauseCircleOutline,
        mdiRadioboxMarked,
        mdiTransferRight
     } from '@mdi/js';

    import { fade } from 'svelte/transition';

    import type { Web } from "sip.js";

    import PhoneInput from './PhoneDialInput.svelte';
    import type { SimpleUserOptions } from 'sip.js/lib/platform/web';
    import { onMount } from 'svelte';

    interface Props {
        // SIP configuration
        sipOptions:SimpleUserOptions;
        sipServer: string;
        phoneNumber?: string;
        
        onCall?: (phoneNumber: string) => void;
        onHangup?: () => void;
        onError?: (error: string) => void;

        sipState?:STATE_MACHINE_STATE;

        control?: {
            call: () => void;
            hangup: () => void;
        };
    }
    let {
        sipOptions,
        sipServer, // 'wss://sip.example.com:443',
        phoneNumber = $bindable('+34623456789'),
        onCall,
        onHangup,
        onError,

        sipState = $bindable(STATE_MACHINE_STATES.CONNECTING_TO_SERVER),

        control = $bindable(undefined)
    }:Props = $props();

    let audioElement:HTMLAudioElement|undefined = $state(undefined);
    let sipJSWeb:(typeof Web)|undefined = $state(undefined);
    let sipUser:Web.SimpleUser|undefined = undefined;
    let sipErrorMessage = $state('');

    // on mount
    onMount(async() => {
        console.log('Importing SvelteSIP library');
        const sipLib = await import('sip.js');
        console.log('SIP.js library imported:');
        sipJSWeb = sipLib.Web;
    });

    function disconnectSipServer() {
        if (sipUser) {
            console.debug('Disconnecting from SIP server');
            sipUser.disconnect();
            sipUser = undefined;
            sipState = STATE_MACHINE_STATES.DISCONNECTED;
        }
    }

    let internalSipOptions:SimpleUserOptions = $derived({
        ...sipOptions,
        media: {
            ...sipOptions.media,
            remote: {
                audio: audioElement
            }
        }
    });

    // parameters for reactivity
    async function connectToSipServer() {
        if (sipUser) {
            disconnectSipServer();
        }
        // Validate SIP server URL
        if (!sipServer.startsWith('wss://') && !sipServer.startsWith('ws://')) {
            sipErrorMessage = 'SIP server must start with "wss://"';
            throw new Error('SIP server must start with "wss://"');
        }

        if (!sipJSWeb) {
            console.error('SIP.js library not loaded');
            return;
        }

        if (!audioElement) {
            console.error('Audio element not found');
            return;
        }

        sipState = STATE_MACHINE_STATES.CONNECTING_TO_SERVER;
        sipErrorMessage = '';

        sipUser = new sipJSWeb.SimpleUser(sipServer, internalSipOptions);

        let sipReady = false;
        console.debug('Connecting to SIP server:', sipServer);
        try {
            await sipUser.connect()
            sipReady = true;
        } catch (error:any) {
            console.error('SIP connection failed:', error);
            sipErrorMessage = error.message;
            sipReady = false;
            sipState = STATE_MACHINE_STATES.SERVER_CONNECTION_ERROR;
            onError?.(error.message);
        }
        if (!sipReady) return;

        // Register to receive incoming calls
        await sipUser.register();
        console.debug('Registered to receive incoming calls');
        sipState = STATE_MACHINE_STATES.IDLE;
    }

    $effect(() => {
        if (!sipJSWeb || !audioElement) return
        // Trigger reactivity 
        if (!sipServer || !internalSipOptions) return

        connectToSipServer();
    })

    // Connect to server and place call
    // simpleUser.connect()
    //     .then(() => simpleUser.call("sip:bob@example.com"))
    //     .catch((error: Error) => {
    //         // Call failed
    //     });

    //     // Handle incoming calls
    // simpleUser.on('invite', (session) => {
    //     // Handle incoming call
    //     console.log('Incoming call from:', session.remoteIdentity.uri);
    // });

    //     const options = {
    //         uri: phoneNumber,
    //         transportOptions: {
    //             server: sipServer,
    //             traceSip: true
    //         },
    //         media: {
    //             constraints: {
    //                 audio: true,
    //                 video: false
    //             },
    //             render: {
    //                 remote: getAudioElement('remoteAudio'),
    //                 local: getAudioElement('localAudio')
    //             }
    //         }
    //     };

    //     const user = new Web.SimpleUser(sipServer, options);

    //     user.on('invite', (session) => {
    //         // Handle incoming call
    //         console.log('Incoming call from:', session.remoteIdentity.uri);
    //     });

    //     user.on('callStateChanged', (state) => {
    //         sipState.set(state);
    //     });

    //     return user;    
    // });

    let callTime = $state('00:00');
    let callError:string|undefined = $state('');

    control = {
        call: () => {
            if (onCall) {
                onCall(phoneNumber);
            }
        },
        hangup: () => {
            if (onHangup) {
                onHangup();
            }
        }
    }


    let phoneNumberValid = $state(true);
    let validationError = $state('');

    // Small contact list for demonstration
    const contacts:Record<string, string> = {
        '+34623456789': 'John Doe',
        '9876543210': 'Jane Smith',
        '5551234567': 'Alice Johnson'
    };

    let contactName = $derived.by(() => {
        return contacts[phoneNumber] || undefined;
    });

    function placeCall(phoneNumber:string) {
        if (sipState !== STATE_MACHINE_STATES.IDLE || !sipUser) {
            console.error('Not connected to SIP server');
            sipErrorMessage = 'Not connected to SIP server';
            sipState = STATE_MACHINE_STATES.SERVER_CONNECTION_ERROR;
            return;
        }
        if (!phoneNumberValid) {
            console.error('Phone number is not valid');
            return;
        }
        if (onCall) {
            onCall(phoneNumber);
        }
        sipUser?.call('bob@example.com');
        sipState = STATE_MACHINE_STATES.CALLING;
    }
    function handleHangup() {
        if (sipState === STATE_MACHINE_STATES.IN_CALL) {
            sipUser?.hangup();
            sipState = STATE_MACHINE_STATES.POST_CALL;
            onHangup?.();
        } else if (sipState === STATE_MACHINE_STATES.POST_CALL) {
            sipState = STATE_MACHINE_STATES.IDLE;
        } else {
            sipState = STATE_MACHINE_STATES.IDLE;
        }
    }
</script>

<audio bind:this={audioElement} autoplay></audio>

{#snippet icon(path:string, mclass:string)}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"
    class={mclass}>
    <path d={path} />
</svg>
{/snippet}

<div class="relative flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-lg max-w-xs mx-auto">
    <div class="text-center text-gray-500 text-sm h-6">
        <!-- MDI person icon -->
        {#if contactName}
            {@render icon(mdiAccountCircle, 'inline-block mr-0.5 h-4')}
            {contactName}
        {/if}
    </div>

    <PhoneInput 
        countryWhitelist={['ES']} disabled={sipState !== STATE_MACHINE_STATES.IDLE}
        bind:value={phoneNumber} 
        bind:valid={phoneNumberValid} bind:validationError />
    
    <div class="flex w-full gap-2">
        <button
            onclick={() => placeCall(phoneNumber)}
            disabled={!phoneNumberValid || phoneNumber.length === 0 || sipState !== STATE_MACHINE_STATES.IDLE}
            class="h-14 group relative flex-grow p-3.5 text-xl font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            Call
        </button>
    </div>

    <div class="text-center text-gray-500 text-sm h-6">
        {#if !phoneNumberValid}
            {validationError}
        {/if}
        {#if sipErrorMessage}
        <div class="text-red-500 relative w-full">
            {@render icon(mdiAlertCircle, 'inline-block mr-0.5 h-4')}
            {sipErrorMessage}

            <!-- retry button -->
            <button class="absolute right-0 top-0 text-gray-500 hover:text-gray-700" onclick={() => connectToSipServer()}>
                {@render icon(mdiRefresh, 'inline-block mr-0.5 h-4')}
            </button>
        </div>
        {/if}
        {#if sipState === STATE_MACHINE_STATES.CONNECTING_TO_SERVER}
            <span class="text-gray-500">
                {@render icon(mdiAlertCircle, 'inline-block mr-0.5 h-4')}
                Connecting to SIP server...
            </span>
        {/if}
    </div>

    {#if sipState === STATE_MACHINE_STATES.CALLING || sipState === STATE_MACHINE_STATES.IN_CALL || sipState === STATE_MACHINE_STATES.POST_CALL}
    <div class="absolute w-full h-full backdrop-blur-md">
        <div class="w-full h-full p-4 grid grid-rows-[1.5rem_auto_1fr_3.5rem_1.5rem] grid-cols-1 gap-0">
            <!-- Spacer -->
            <div class=""></div>
        
            <!-- Caller ID Block: show mdiAccountCircle, then username in large, then phone number -->
            <div class="grid grid-cols-[auto_1fr_auto] gap-2 h-16">
                {@render icon(mdiAccountCircle, 'inline-block mr-0.5 h-16 w-auto row-span-2')}

                <div class="text-left text-gray-500 text-2xl h-6 col-span-2">
                    {contactName}
                </div>
                <div class="text-left text-gray-500 text-sm h-6">
                    {phoneNumber}
                </div>

                <div class="text-left text-gray-500 text-sm h-6">
                    {#if sipState === STATE_MACHINE_STATES.IN_CALL}
                    {callTime}
                    {/if}
                </div>
            </div>

            {#snippet actionButton(iconPath:string, text:string, onclick?:() => void)}
            <button
                class="flex flex-col"
                onclick={onclick}
            >
                {@render icon(iconPath, 'inline-block mr-0.5 h-12 w-auto')}
                {text}
            </button>
            {/snippet}

            {#if sipState === STATE_MACHINE_STATES.CALLING}
            <div class="text-center text-gray-500 text-sm my-auto flex flex-col items-center justify-center" transition:fade>
                <div class="animate-ping h-8 w-8 rounded-full bg-gray-500 opacity-75"></div>
                <span class="mt-4">
                    Establishing call...
                </span>
            </div>
            {:else if sipState === STATE_MACHINE_STATES.IN_CALL}
            <!-- 4 buttons grid with svg mdi icons mute,hold,transfer,info -->
            <div class="grid grid-cols-2 gap-8 h-auto my-auto mx-auto" transition:fade>
                {@render actionButton(mdiMicrophoneOff, 'Mute')}
                {@render actionButton(mdiPauseCircleOutline, 'Hold')}
                {@render actionButton(mdiTransferRight, 'Transfer')}
                {@render actionButton(mdiRadioboxMarked, 'Record')}
            </div>
            {:else if sipState === STATE_MACHINE_STATES.POST_CALL}
            <div class="text-center text-gray-500 text-sm h-auto my-auto">
                {#if callError}
                    <h3 class="text-xl">Could not place call</h3>
                    <span>{callError}</span>
                {:else}
                    <h3 class="text-xl">Call ended</h3>
                    <span>Duration {callTime}</span>
                {/if}
            </div>
            {/if}
            


            <button
                onclick={handleHangup}
                class="group relative flex-grow h-14 p-3.5 text-xl font-semibold text-white
                transition-colors
                {(sipState === STATE_MACHINE_STATES.IN_CALL) ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}
                rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            >
                {#if sipState === STATE_MACHINE_STATES.IN_CALL}
                    Hangup
                {:else if sipState === STATE_MACHINE_STATES.POST_CALL}
                    OK
                {:else}
                    Cancel
                {/if}
            </button>

            {#if sipState === STATE_MACHINE_STATES.IN_CALL}
            <div class="text-center text-gray-500 text-sm h-6">
                STATS: 5kbps
            </div>
            {/if}
        </div>
    </div>
    {/if}
</div>