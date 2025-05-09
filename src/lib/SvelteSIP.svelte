<script lang="ts">
    import { mdiAccountCircle } from '@mdi/js';

    import PhoneInput from './PhoneDialInput.svelte';

    let phoneNumber = $state('');
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

<div class="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-lg max-w-xs mx-auto">
    <div class="text-center text-gray-500 text-sm h-6">
        <!-- MDI person icon -->
        {#if contactName}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"
                class="inline-block mr-0.5 h-4">
                <path d={mdiAccountCircle} />
            </svg>
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
            class="group relative flex-grow p-4 text-xl font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            Call
        </button>
    </div>
    <div class="text-center text-gray-500 text-sm h-6">
        {#if !phoneNumberValid}
            {validationError}
        {/if}
    </div>
</div>