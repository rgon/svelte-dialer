<script module lang="ts">
    export const STATE_MACHINE_STATES = {
        IDLE: 'IDLE',
        CALLING: 'CALLING',
        IN_CALL: 'IN_CALL',
        HANGING_UP: 'HANGING_UP'
    } as const;

    export type STATE_MACHINE_STATE = keyof typeof STATE_MACHINE_STATES;
</script>

<script lang="ts">
    import { mdiAccountCircle,
        mdiMicrophoneOff,
        mdiPauseCircleOutline,
        mdiRadioboxMarked,
        mdiTransferRight
     } from '@mdi/js';

    import PhoneInput from './PhoneDialInput.svelte';

    interface Props {
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
        phoneNumber = $bindable('+34623456789'),
        onCall,
        onHangup,
        onError,

        sipState = $bindable(STATE_MACHINE_STATES.IN_CALL),

        control = $bindable(undefined)
    }:Props = $props();

    let callTime = $state('00:00');

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

    function makeCall() {
        if (phoneNumber.length > 0) {
            alert(`Calling ${contactName ? contactName + ' (' + phoneNumber + ')' : phoneNumber}...`);
            // Implement actual call logic here
        }
    }
</script>


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
        countryWhitelist={['ES']} disabled={false}
        bind:value={phoneNumber} 
        bind:valid={phoneNumberValid} bind:validationError />
    
    <div class="flex w-full gap-2">
        <button
            onclick={makeCall}
            disabled={!phoneNumberValid || phoneNumber.length === 0}
            class="h-14 group relative flex-grow p-3.5 text-xl font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            Call
        </button>
    </div>

    <div class="text-center text-gray-500 text-sm h-6">
        {#if !phoneNumberValid}
            {validationError}
        {/if}
    </div>

    {#if sipState === STATE_MACHINE_STATES.CALLING || sipState === STATE_MACHINE_STATES.IN_CALL || sipState === STATE_MACHINE_STATES.HANGING_UP}
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
                    {callTime}
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

            <!-- 4 buttons grid with svg mdi icons mute,hold,transfer,info -->
            <div class="grid grid-cols-2 gap-8 h-auto my-auto mx-auto">
                {@render actionButton(mdiMicrophoneOff, 'Mute')}
                {@render actionButton(mdiPauseCircleOutline, 'Hold')}
                {@render actionButton(mdiTransferRight, 'Transfer')}
                {@render actionButton(mdiRadioboxMarked, 'Record')}
            </div>

            <button
                onclick={onHangup}
                class="group relative flex-grow h-14 p-3.5 text-xl font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            >
                Hang Up
            </button>

            <div class="text-center text-gray-500 text-sm h-6">
                STATS: 5kbps
            </div>
        </div>
    </div>
    {/if}
</div>