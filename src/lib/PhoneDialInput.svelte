<script lang="ts">
	import 'svelte-tel-input/styles/flags.css';
    import { mdiBackspace, mdiAccountCircle } from '@mdi/js';

    import { TelInput, normalizedCountries } from 'svelte-tel-input';
    import type { DetailedValue, CountryCode, E164Number } from 'svelte-tel-input/types';
    import { longpress } from './actions/longPress';
    import { clickOutsideAction } from './actions/clickOutside';

    interface Props {
        // E164 number format. It's guarantee the parsing and storing consistency.
        value: E164Number | string | null;
        // Any Country Code Alpha-2 (ISO 3166)
        selectedCountry?: CountryCode | null;
        // Optional - Extended details about the parsed phone number
        detailedValue?: DetailedValue | null;
        contactName?: string;
        valid?: boolean;
        validationError?: string;
    }
    let {
        value = $bindable(''),
        valid = $bindable(true),
        selectedCountry = $bindable(null),
        validationError = $bindable(''),
        detailedValue = $bindable(null),
        contactName,
    }:Props = $props();

    $effect(() => {
        if (value?.length ?? 0 > 0) {
            // valid = /^\+?[0-9]*$/.test(value);
            validationError = valid ? '' : 'Invalid phone number';
        } else {
            // valid = false;
            validationError = '';
        }
    });

    let textInput: HTMLInputElement | undefined = $state(undefined);
    
    let countryDropdownOpen = $state(false);

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

    function addKey(key: string) {
        if (!textInput) return;

        // Modify text input value
        textInput.value = textInput.value + key;
        // Dispatch input event
        textInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function deleteLastChar() {
        if (!textInput) return;

        // Modify text input value
        textInput.value = textInput.value.slice(0, -1);
        // Dispatch input event
        textInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function focusInput() {
        textInput?.focus();
    }
</script>

<div class="mb-4 w-full" use:clickOutsideAction={() => { countryDropdownOpen = false }}>
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
    
    <div class="relative flex flex-row gap-0 items-center justify-center
        w-full bg-white border border-gray-300 rounded-md
        showDeleteButtonIfPlaceholder">
        <!-- <select
            class="h-full pt-1 pl-1 text-sm w-16 grow-0 shrink-0
            text-center bg-white border border-gray-300 rounded-md"
            aria-label="Default select example"
            name="Country"
            bind:value={selectedCountry}
        >
            <option value={null} hidden={selectedCountry !== null}>Please select</option>
            {#each normalizedCountries as currentCountry (currentCountry.id)}
            <option
                value={currentCountry.iso2}
                selected={currentCountry.iso2 === selectedCountry}
                aria-selected={currentCountry.iso2 === selectedCountry}
            >
                {currentCountry.iso2}
                
                (+{currentCountry.dialCode})
            </option>
            {/each}
        </select> -->
        <button
			id="states-button"
			data-dropdown-toggle="dropdown-states"
			class="
                opacity-0
                {value?.length??0 > 0 ? 'opacity-100' : ''} transition-opacity
                relative flex-shrink-0 overflow-hidden z-10 whitespace-nowrap inline-flex items-center 
                py-2.5 pl-2 text-sm font-medium text-center text-gray-500 
                focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
			type="button"
			role="combobox"
			aria-controls="dropdown-countries"
			aria-expanded="false"
			aria-haspopup="false"
			onclick={() => { countryDropdownOpen = !countryDropdownOpen }}
		>
			{#if selectedCountry && selectedCountry !== null}
                {@const selectedCountryDialCode = normalizedCountries.find((country) => country.iso2 === selectedCountry)?.dialCode}
				<div class="inline-flex items-center text-left">
					<span class="flag flag-{selectedCountry.toLowerCase()} flex-shrink-0 mr-1"></span>
                    <span class=" text-gray-600 dark:text-gray-400">(+{selectedCountryDialCode})</span>
				</div>
			{:else}
				select
			{/if}
		</button>

        <TelInput
            bind:country={selectedCountry}
            bind:value={value}
            bind:valid
            bind:detailedValue
            bind:el={textInput}
            options={{
                // format: 'international'
                // invalidateOnCountryChange: true,
            }}
            on:updateValue={(event) => {
                console.log('event', event);
            }}
            class="p-3 px-1 text-2xl text-center w-16 grow shrink-0 focus:outline-none"
        />
        <button
            type="button"
            aria-label="Backspace"
            onpointerup={focusInput}

            use:longpress
            onshortpress={deleteLastChar}
            onlongpress={(event) => event.target?.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true }))}
            oncontextmenu={(event) => { event.preventDefault(); value = ''; focusInput() }}

            class="notIfInputEmpty
            absolute right-2 top-0 bottom-0 inset-y-0 flex items-center text-gray-600 hover:text-gray-800"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d={mdiBackspace} />
            </svg>
        </button>

        <!-- Spacer that can shrink -->
        <div class="w-16 shrink"></div>
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
            onshortpress={(event) => {if (!event?.defaultPrevented) addKey(button.value) }}
            onlongpress={(event) => event.target?.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true }))}
            oncontextmenu={(event) => { event.preventDefault(); button.longPressValue ? addKey(button.longPressValue) : null }}

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
<!-- 
{#if countryDropdownOpen}
    <div
        id="dropdown-countries"
        class="absolute z-10 max-w-fit bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 overflow-hidden translate-y-11"
        data-popper-reference-hidden=""
        data-popper-escaped=""
        data-popper-placement="bottom"
        aria-orientation="vertical"
        aria-labelledby="country-button"
        tabindex="-1"
    >
        <div
            class="text-sm text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto"
            aria-labelledby="countries-button"
            role="listbox"
        >
            <input
                aria-autocomplete="list"
                type="text"
                class="px-4 py-2 text-gray-900 focus:outline-none w-full sticky top-0"
                bind:value={countrySearchText}
                placeholder="Search"
            />
            {#each sortCountries(normalizedCountries, countrySearchText) as country (country.id)}
                {@const isActive = isSelected(country.iso2, selectedCountry)}
                <div id="country-{country.iso2}" role="option" aria-selected={isActive}>
                    <button
                        value={country.iso2}
                        type="button"
                        class="inline-flex py-2 px-4 w-full text-sm hover:bg-gray-100 dark:hover:bg-gray-600
                        active:bg-gray-800 dark:active:bg-gray-800 overflow-hidden
                    {isActive
                            ? 'bg-gray-600 dark:text-white'
                            : 'dark:hover:text-white dark:text-gray-400'}"
                        on:click={(e) => {
                            handleSelect(country.iso2, e);
                        }}
                    >
                        <div class="inline-flex items-center text-left">
                            <span
                                class="flag flag-{country.iso2.toLowerCase()} flex-shrink-0 mr-3"
                            />
                            <span class="mr-2">{country.name}</span>
                            <span class="text-gray-500">+{country.dialCode}</span>
                        </div>
                    </button>
                </div>
            {/each}
        </div>
    </div>
{/if} -->

<style lang="postcss">
    .showDeleteButtonIfPlaceholder > .notIfInputEmpty {
        @apply opacity-0;
    }
    .showDeleteButtonIfPlaceholder :global(input:not(:placeholder-shown) + .notIfInputEmpty) {
        @apply opacity-100;
    }
</style>