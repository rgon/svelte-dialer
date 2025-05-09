<script lang="ts">
    import '../app.css';
    import SvelteSIP from '$lib/SvelteSIP.svelte';
</script>

<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 w-full sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div class="max-w-md mx-auto">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-800 text-center">Svelte SIP Dialer</h1>
                </div>
                <div class="divide-y divide-gray-200">
                    <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                        <!-- <p>Check out this awesome component!</p> -->
                        <SvelteSIP />
                    </div>
                    
                    <div class="pt-6 text-base leading-6 sm:text-lg sm:leading-7">
                        <p class="text-gray-400 text-center">
                            MIT Licensed
                            <br>
                            by <a href="https://github.com/rgon">github.com/rgon</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
