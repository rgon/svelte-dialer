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
+ [x] UI: currently calling view with blur. Mute/statistics/hold/transfer
+ [x] Implement Sip.js: settings & initialization
+ [x] Basic server connection. Server connection information.
+ [x] retry server connection
+ [x] place call method
+ [x] hangup method
+ [x] handle call events. Handle call time
+ [x] Implement control, Event callbacks
+ [x] Fix ui animations @ call flow
+ [ ] sip proxy minimal working example. Use routr.io since it looks awesome
    + [ ] add secrets? Edit yaml?
+ [ ] incoming call UI and implementation
        await sipUser?.answer();
    + [ ] animated screen

+ [ ] dialer in call for DTMF

+ [ ] UI: clear phone number after call (prevent retry click)
+ [ ] Recents list UI (fetchRecents option) -> view user recents (?) optional

+ [ ] UX: determine if call finally established or not

----
+ [ ] backend minimal example
    + [ ] activate debug logging
+ [ ] fetch credentials from env
+ [ ] example env file
## Usage

```svelte
<!-- Dummy usage -->
<SvelteSIP />
```

## Backend setup notes
Please note that you will need a sip account on a server that supports SIP over websockets. Test if your provider allows that. If not, you may need to setup a PBX or SIP router to manage your calls.