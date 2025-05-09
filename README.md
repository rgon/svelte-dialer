# svelte-sip

SIP Caller component using svelte

## Acceptance criteria
+ [x] UI: modern, similar to Android/iOS calling
+ [x] UX: longpress inpup
+ [x] UI: caller ID
+ [x] UX: keep input focused after pressing keyboard buttons
+ [x] UX: svelte phone validation (country etc)
+ [x] Split into phoneInputComponent -> export enter event
+ [x] feat: country search
+ [x] feat: SIP Limit calling countries by code
+ [x] config: contact options, bind value, control:{setPhoneNumber, call}
    interface Props {
        onCall?: (phoneNumber: string) => void;
        phoneNumber?: string;
        phoneNumberValid?: boolean;
        validationError?: string;
    }
+ [ ] UI: currently calling view with blur. Mute/statistics/hold/transfer
+ [ ] Recents list UI (fetchRecents option) -> view user recents (?) optional
+ [ ] Event Out callbacks
+ [ ] Implement Sip.js settings

## Usage

```svelte
<!-- Dummy usage -->
<SvelteSIP />
```

## Backend setup notes
Please note that you will need a sip account on a server that supports SIP over websockets. Test if your provider allows that. If not, you may need to setup a PBX or SIP router to manage your calls.