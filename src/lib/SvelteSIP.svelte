<script lang="ts">
    import { fade } from 'svelte/transition';
    import PhoneInput from './PhoneDialInput.svelte';

    let phoneNumber = $state('');
    let phoneNumberValid = $state(true);
    let validationError = $state('');

    // Small contact list for demonstration
    const contacts:Record<string, string> = {
        '+341234567890': 'John Doe',
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

<div class="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-lg max-w-xs mx-auto">
    <PhoneInput bind:value={phoneNumber} {contactName} bind:valid={phoneNumberValid} bind:validationError />
    
    <div class="flex w-full gap-2">
        <button
            onclick={makeCall}
            disabled={!phoneNumberValid}
            class="group relative flex-grow p-4 text-xl font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            Call
            {#if !phoneNumberValid}
                <span class="opacity-0 group-hover:opacity-100 absolute bottom-1 left-0 right-0 mx-auto font-normal text-xs text-gray-500 ml-2" in:fade>
                    {validationError}
                </span>
            {/if}
        </button>
    </div>
</div>