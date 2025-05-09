# svelte-sip

SIP Caller component using svelte

## Project status
+ [ ] UI: basic
+ [ ] UX: longpress inpup
+ [ ] UI: caller ID
+ [ ] UX: keep focus: after pushing button, keep focus
> commit
+ [ ] UX: svelte phone validation (country etc)
+ [ ] Split into phoneInputComponent -> export enter event
> commit
+ [ ] feat: SIP Limit calling countries by code
+ [ ] config: contact options, bind value, control:{setPhoneNumber, call}
+ [ ] Recents list UI (fetchRecents option)
+ [ ] Event Out callbacks
+ [ ] Implement Sip.js settings

## Usage

```svelte
<!-- Dummy usage -->
<SvelteSIP />
```

## Backend setup notes
Please note that you will need a sip account on a server that supports SIP over websockets. Test if your provider allows that. If not, you may need to setup a PBX or SIP router to manage your calls.