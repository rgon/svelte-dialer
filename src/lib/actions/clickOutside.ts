import type { ActionReturn } from 'svelte/action';

interface ClickOutsideOptions {
    handler: () => void;
    skipPrevented?: boolean;
}
// interface Attributes {
//     'onclickoutside': (e: CustomEvent) => void;
// }

export function clickOutsideAction (
	node: HTMLElement,
	handler: () => void,
	skipPrevented = true
): ActionReturn<ClickOutsideOptions> {
	const handleClick = async (event: MouseEvent) => {
		if (skipPrevented) {
			if (!node.contains(event.target as HTMLElement) && !event.defaultPrevented) handler();
		} else {
			if (!node.contains(event.target as HTMLElement)) handler();
		}
	};

	document.addEventListener('click', handleClick, true);
	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};