<script lang="ts">
	import 'svelte-tel-input/styles/flags.css';
    import { tick } from 'svelte';
    import { fade } from 'svelte/transition';
    import { mdiBackspace } from '@mdi/js';

    import { TelInput, normalizedCountries, isSelected } from 'svelte-tel-input';
    import type { DetailedValue, CountryCode, E164Number, Country } from 'svelte-tel-input/types';
    import { longpress } from './actions/longPress';
    import { clickOutsideAction } from './actions/clickOutside';

    interface Props {
        // E164 number format. It's guarantee the parsing and storing consistency.
        value: E164Number | string | null;
        // Any Country Code Alpha-2 (ISO 3166)
        selectedCountry?: CountryCode | null;
        // Optional - Extended details about the parsed phone number
        detailedValue?: DetailedValue | null;
        valid?: boolean;
        validationError?: string;
        
        // Array of Country Code Alpha-2 (ISO 3166)
        defaultCountries?: string[]; 
        // Array of Country Code Alpha-2 (ISO 3166)
        countryWhitelist?: CountryCode[];

        disabled?: boolean;

        class?: string;
    }
    let {
        value = $bindable(''),
        valid = $bindable(false),
        selectedCountry = $bindable(null),
        validationError = $bindable(''),
        detailedValue = $bindable(null),
        
        defaultCountries = [],
        countryWhitelist = [],
        disabled = false,

        class:mClass = ''
    }:Props = $props();

    $effect(() => {
        if (countryWhitelist && selectedCountry && !countryWhitelist.includes(selectedCountry)) {
            validationError = 'Invalid country code';
            valid = false;
        } else if (value?.length ?? 0 > 0) {
            validationError = valid ? '' : 'Invalid phone number';
        } else {
            // valid = false;
            validationError = '';
        }
    });

    let textInput: HTMLInputElement | undefined = $state(undefined);
    

    /* ****************** Keypad ****************** */
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

    /* ****************** Country Dropdown ****************** */
    let countryDropdownOpen = $state(false);
    let countrySearchText = $state('');
    
    // svelte-ignore non_reactive_update
    let countryDropdownContainer:HTMLDivElement|undefined;

    function focusCountrySearch () {
        countryDropdownContainer?.getElementsByTagName('input')[0]?.focus()
    }

    let sortedCountries:Country[] = $state([])
    $effect(() => {
        // Derived does not work?
        sortedCountries = sortCountries(normalizedCountries, countrySearchText)
    })
    async function toggleDropDown (e?: Event) {
        e?.preventDefault();
		if (disabled) return;
		countryDropdownOpen = !countryDropdownOpen;
        await tick()
        focusCountrySearch();
	};

    function onDropdownKeyPress (e:KeyboardEvent) {
        // if key is text (not enter/space etc)
        if (e.key.length === 1) {
            (e.target as HTMLElement)?.click();
            countrySearchText += e.key;
            focusCountrySearch();
        }
    }

    function onCountrySearchInput (e:KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // select current value
            handleSelect(sortedCountries[0].iso2);
        }
        countryDropdownContainer?.scrollTo(0, 0)
    }

    async function closeDropdown (e?: Event) {
		if (countryDropdownOpen) {
			e?.preventDefault();
			countryDropdownOpen = false;
			countrySearchText = '';
            await tick()
            focusInput();
		}
	};

	function sortCountries (countries: Country[], text: string) {
		const normalizedText = text.trim().toLowerCase().replaceAll('+','');
		if (!normalizedText) {
			return countries.sort((a, b) => {
                if (defaultCountries && defaultCountries.includes(a.id)) return -1;
                if (defaultCountries && defaultCountries.includes(b.id)) return 1;
                return a.label.localeCompare(b.label)
            });
		}
		return countries.sort((a, b) => {
			const aNameLower = a.name.toLowerCase();
			const bNameLower = b.name.toLowerCase();
			const aStartsWith = aNameLower.startsWith(normalizedText);
			const bStartsWith = bNameLower.startsWith(normalizedText);
            if (normalizedText.startsWith(String(a.dialCode))) return -1;
            if (normalizedText.startsWith(String(b.dialCode))) return 1;
			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			const aIndex = aNameLower.indexOf(normalizedText);
			const bIndex = bNameLower.indexOf(normalizedText);
			if (aIndex === -1 && bIndex === -1) return a.id.localeCompare(b.id);
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			const aWeight = aIndex + (aStartsWith ? 0 : 1);
			const bWeight = bIndex + (bStartsWith ? 0 : 1);
			return aWeight - bWeight;
		});
	};

	async function handleSelect (val: CountryCode, e?: Event) {
		if (disabled) return;
		e?.preventDefault();
		if (
			selectedCountry === undefined ||
			selectedCountry === null ||
			(typeof selectedCountry === typeof val && selectedCountry !== val)
		) {
			selectedCountry = val;
			// onChange(val);
			closeDropdown();
		} else {
			// onsame?.({ option: val });
			closeDropdown();
		}
	};
</script>

<div class="w-full relative {mClass}" use:clickOutsideAction={() => { countryDropdownOpen = false }}>
    <div class="mb-4 w-full">
        <div class="
            h-14
            relative grid grid-cols-[1fr_auto_1fr] grid-rows-1 gap-0.5 items-center justify-center
            w-full bg-white border border-gray-300 rounded-md
            showDeleteButtonIfPlaceholder">
            <button
                id="states-button"
                data-dropdown-toggle="dropdown-states"
                class="
                    relative flex-shrink-0 flex-grow-0 w-auto
                    py-3 pl-1.5
                    focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
                type="button"
                role="combobox"
                aria-controls="dropdown-countries"
                aria-expanded="false"
                aria-haspopup="false"
                onclick={toggleDropDown}
                onkeypress={onDropdownKeyPress}
            >
                {#if selectedCountry}
                    {@const selectedCountryDialCode = normalizedCountries.find((country) => country.iso2 === selectedCountry)?.dialCode}
                    <div class="relative inline-block text-left w-full" transition:fade={{ duration: 200 }}>
                        <span class="absolute left-0 top-0 bottom-0 my-auto flag flag-{selectedCountry.toLowerCase()}"></span>
                        <span class="ml-[26px] pl-1 text-gray-600 dark:text-gray-400 text-xl font-normal">+{selectedCountryDialCode}</span>
                    </div>
                {:else}
                    <span class="mt-1 inline-block leading-none uppercase text-xs text-gray-400">select<br>country</span>
                {/if}
            </button>
    
            <TelInput
                bind:country={selectedCountry}
                bind:value={value}
                bind:valid
                bind:detailedValue
                bind:el={textInput}
                {disabled}
                options={{
                    // format: 'international'
                    // invalidateOnCountryChange: true,
                }}
                placeholder="&nbsp;"
                class="p-3 px-0 text-xl text-center w-full grow focus:outline-none"
            />
            <button
                type="button"
                aria-label="Backspace"
                {disabled}
                onpointerup={focusInput}
    
                use:longpress
                onshortpress={() => { if (!disabled) deleteLastChar() }}
                onlongpress={(event) => event.target?.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true }))}
                oncontextmenu={(event) => { event.preventDefault(); if (!disabled) { value = ''; focusInput() }}}
    
                class="
                    notIfInputEmpty
                    absolute right-2 top-0 bottom-0 inset-y-0 flex items-center {disabled ? "text-gray-400" : "text-gray-600 hover:text-gray-800"}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d={mdiBackspace} />
                </svg>
            </button>
    
            <!-- Spacer that can shrink -->
            <div class="w-18 shrink"></div>
        </div>
    </div>

    {#if countryDropdownOpen}
        <div
            id="dropdown-countries"
            class="absolute left-0 z-10 
                max-w-fit w-full h-auto aspect-square
                overflow-y-auto
                text-sm
                text-gray-700 
                bg-white rounded
                divide-y divide-gray-50
                shadow overflow-hidden"
            data-popper-reference-hidden=""
            data-popper-escaped=""
            data-popper-placement="bottom"
            aria-orientation="vertical"
            tabindex="-1"
            aria-labelledby="countries-button"
            role="listbox"
            bind:this={countryDropdownContainer}
        >
            <input
                aria-autocomplete="list"
                type="text"
                class="px-4 py-2
                    bg-white text-gray-900 focus:outline-none w-full sticky top-0"
                bind:value={countrySearchText}
                onkeypress={onCountrySearchInput}
                placeholder="Search"
            />
            {#each sortedCountries as country (country.id)}
                {@const isActive = isSelected(country.iso2, selectedCountry)}
                <div id="country-{country.iso2}" role="option" aria-selected={isActive}>
                    <button
                        value={country.iso2}
                        type="button"
                        class="inline-flex py-2 px-4 w-full text-sm 
                        hover:bg-gray-100
                        active:bg-gray-200  overflow-hidden
                    {isActive
                            ? 'bg-gray-200 dark:text-white'
                            : 'dark:hover:text-white dark:text-gray-400'}"
                        onclick={(e) => {
                            handleSelect(country.iso2, e);
                        }}
                    >
                        <div class="inline-flex items-center text-left">
                            <span class="flag flag-{country.iso2.toLowerCase()} flex-shrink-0 mr-3"></span>
                            <span class="mr-2">{country.name}</span>
                            <span class="text-gray-500">+{country.dialCode}</span>
                        </div>
                    </button>
                </div>
            {/each}
        </div>
    {/if}
    
    <div class="grid grid-cols-3 gap-2 w-full mb-4">
        {#each buttons as button}
            <button
                type="button"
                tabindex="-1"
                {disabled}

                onpointerup={focusInput}
                onpointerdown={focusInput}
                
                use:longpress
                onshortpress={(event) => {if (!event?.defaultPrevented && !disabled) addKey(button.value) }}
                onlongpress={(event) => event.target?.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true }))}
                oncontextmenu={(event) => { event.preventDefault(); (button.longPressValue && !disabled) ? addKey(button.longPressValue) : null }}
    
                class="relative text-center
                        p-4 text-xl font-semibold
                        bg-gray-200
                        {disabled ? ' text-gray-400' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                        rounded-full focus:outline-none transition-colors"
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
    
</div>

<style lang="postcss">
    .showDeleteButtonIfPlaceholder > .notIfInputEmpty {
        @apply opacity-0;
    }
    .showDeleteButtonIfPlaceholder :global(input:not(:placeholder-shown) + .notIfInputEmpty) {
        @apply opacity-100;
    }
</style>