<script lang="ts">
    import { 
        PUBLIC_SIP_AOR as SIP_AOR,
        PUBLIC_SIP_CALL_URI_PREFIX as SIP_CALL_URI_PREFIX,
        PUBLIC_SIP_CALL_URI_SUFFIX as SIP_CALL_URI_SUFFIX,
        PUBLIC_SIP_SERVER as SIP_SERVER,
        PUBLIC_SIP_AUTH_USERNAME as SIP_AUTH_USERNAME,
        PUBLIC_SIP_AUTH_PASSWORD as SIP_AUTH_PASSWORD,
    } from '$env/static/public'

    import '../app.css';
    import SvelteSIP from '$lib/SvelteSIP.svelte';

    const settings = {
        SIP_AOR,
        SIP_CALL_URI_PREFIX,
        SIP_CALL_URI_SUFFIX,
        SIP_SERVER,
        SIP_AUTH_USERNAME,
        SIP_AUTH_PASSWORD
    };
    
    if (!SIP_AOR || !SIP_SERVER || !SIP_AUTH_USERNAME || !SIP_AUTH_PASSWORD) {
        throw new Error('Missing SIP environment variables. Please create a .env file following .env.example');
    }
</script>

<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 w-full sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>

        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div class="max-w-md mx-auto">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-800 text-center">Svelte SIP Dialer</h1>
                </div>
                <div class="">
                    <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                        <!-- <p>Check out this awesome component!</p> -->
                        <SvelteSIP
                            defaultCountries={['ES', 'US']}
                            getSipCallUri={(phoneNumber) => `${settings.SIP_CALL_URI_PREFIX}${phoneNumber}${settings.SIP_CALL_URI_SUFFIX}`}
                            sipServer={settings.SIP_SERVER}
                            sipOptions={{
                                aor: settings.SIP_AOR,
                                userAgentOptions: {
                                    authorizationUsername: settings.SIP_AUTH_USERNAME,
                                    authorizationPassword: settings.SIP_AUTH_PASSWORD
                                },
                                media: {
                                    constraints: {
                                        audio: true,
                                        video: false
                                    }
                                }
                            }} />
                    </div>
                    
                    <!-- Simple configuration -->
                    <details class="max-w-[320px] mx-auto open:border-t open:border-b border-gray-200">
                        <summary class="cursor-pointer text-gray-400 hover:text-gray-700">
                            <span class="font-semibold">Server configuration</span>
                        </summary>
                        <div class="py-4 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <!-- Edit with input bind:value={} -->
                            <div class="flex flex-col gap-2">
                                <label for="sipAor" class="text-gray-500">SIP AOR</label>
                                <input id="sipAor" type="text" bind:value={settings.SIP_AOR} class="border border-gray-300 rounded p-2" />

                                <label for="sipServer" class="text-gray-500">SIP Server</label>
                                <input id="sipServer" type="text" bind:value={settings.SIP_SERVER} class="border border-gray-300 rounded p-2" />

                                <label for="sipAuthUsername" class="text-gray-500">SIP Auth Username</label>
                                <input id="sipAuthUsername" type="text" bind:value={settings.SIP_AUTH_USERNAME} class="border border-gray-300 rounded p-2" />
                                <label for="sipAuthPassword" class="text-gray-500">SIP Auth Password</label>
                                <input id="sipAuthPassword" type="password" bind:value={settings.SIP_AUTH_PASSWORD} class="border border-gray-300 rounded p-2" />

                                <label for="sipCallUriPrefix" class="text-gray-500">SIP Caller Format</label>
                                <div class="flex flex-row justify-stretch items-center w-full">
                                    <input id="sipCallUriPrefix" type="text" bind:value={settings.SIP_CALL_URI_PREFIX} class="border border-gray-300 rounded p-2 w-12" />
                                    <span class="text-gray-500">phoneNumber</span>
                                    <input id="sipCallUriSuffix" type="text" bind:value={settings.SIP_CALL_URI_SUFFIX} class="border border-gray-300 rounded p-2 w-40" />
                                </div>
                        </div>
                    </details>

                    <div class="pt-6 text-base leading-6 sm:text-lg sm:leading-7">
                        <p class="text-gray-400 text-center">
                            GPL v3
                            <br>
                            by <a href="https://github.com/rgon">github.com/rgon</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
