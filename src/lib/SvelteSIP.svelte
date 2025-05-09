<script lang="ts">
    import { mdiBackspace, mdiAccountCircle } from '@mdi/js';
    import { longpress } from './longPress';

    let textInput: HTMLInputElement | null = null;
    let phoneNumber = $state('');

    const buttons = [
        { value: '1', longPressValue: null },
        { value: '2', longPressValue: null },
        { value: '3', longPressValue: null },
        { value: '4', longPressValue: null },
        { value: '5', longPressValue: null },
        { value: '6', longPressValue: null },
        { value: '7', longPressValue: null },
        { value: '8', longPressValue: null },
        { value: '9', longPressValue: null },
        { value: '*', longPressValue: null },
        { value: '0', longPressValue: '+' },
        { value: '#', longPressValue: null }
    ];

    // Small contact list for demonstration
    const contacts:Record<string, string> = {
        '1234567890': 'John Doe',
        '9876543210': 'Jane Smith',
        '5551234567': 'Alice Johnson'
    };

    let contactName = $derived.by(() => {
        return contacts[phoneNumber] || undefined;
    });

    function deleteLastChar() {
        phoneNumber = phoneNumber.slice(0, -1);
    }
    function focusInput() {
        textInput?.focus();
    }

    function makeCall() {
        if (phoneNumber.length > 0) {
            alert(`Calling ${contactName ? contactName + ' (' + phoneNumber + ')' : phoneNumber}...`);
            // Implement actual call logic here
        }
    }
</script>

<div class="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-lg max-w-xs mx-auto">
    <div class="mb-4 w-full">
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
        <div class="relative">
            <input
                type="text"
                bind:this={textInput}
                bind:value={phoneNumber}
                class="w-full p-3 text-2xl text-center bg-white border border-gray-300 rounded-md focus:outline-none"
                />
            <!-- placeholder="Enter number" -->
            {#if phoneNumber.length > 0}
                <button
                    type="button"
                    aria-label="Backspace"
                    onpointerup={focusInput}

                    use:longpress
                    onshortpress={deleteLastChar}
                    onlongpress={(event) => event.target?.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true }))}
                    oncontextmenu={(event) => { event.preventDefault(); phoneNumber = ''; focusInput() }}

                    class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 hover:text-gray-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d={mdiBackspace} />
                    </svg>
                </button>
            {/if}
        </div>
    </div>

    <div class="grid grid-cols-3 gap-2 w-full mb-4">
        {#each buttons as button}
            <button
                type="button"
                tabindex="-1"

                onpointerup={focusInput}
                onpointerdown={focusInput}
                
                use:longpress
                onshortpress={(event) => {if (!event?.defaultPrevented) phoneNumber += button.value }}
                onlongpress={(event) => event.target?.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true }))}
                oncontextmenu={(event) => { event.preventDefault(); button.longPressValue ? (phoneNumber += button.longPressValue) : null }}

                class="relative text-center
                     p-4 text-xl font-semibold
                     bg-gray-200 hover:bg-gray-300 rounded-full focus:outline-none transition-colors"
            >
                {button.value}
                {#if button.longPressValue}
                    <div class="absolute bottom-1 left-0 right-0 mx-auto text-center text-xs text-gray-600">
                        {button.longPressValue}
                    </div>
                {/if}
            </button>
        {/each}
    </div>

    <div class="flex w-full gap-2">
        <button
            onclick={makeCall}
            disabled={phoneNumber.length === 0}
            class="flex-grow p-4 text-xl font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            Call
        </button>
    </div>
</div>