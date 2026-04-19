const config = {
    // -----------------------------------------
    // 1. CORE CONFIGS (REQUIRED)
    // -----------------------------------------
    profile: {
        name: "SlateLink",
        role: "Minimalist Biolink for Developers and Professionals",
        status: "Demo Mode | Fully Configurable",
        image: "https://ui-avatars.com/api/?name=Slate+Link", 
    },

    tabs: [
        { id: "preview", label: "Preview" },
        { id: "feature", label: "Features" },
    ],

    socials: [
        // type: "link" for redirect
        // type: "copy" for copy the link
        { icon: "github-logo", url: "https://github.com/javierrayhan/SlateLink", type: "link" },
        { icon: "globe", url: "https://zavieray.my.id", type: "link" }, 
        { icon: "instagram-logo", url: "#", type: "link" },
        { icon: "linkedin-logo", url: "#", type: "link" },
        { icon: "envelope-simple", url: "mailto:hello@example.com", type: "link" } 
    ],

    // -----------------------------------------
    // 2. FEATURE FLAGS & ADD-ONS (OPTIONAL)
    // -----------------------------------------
    features: {
        // --- SECURITY & ANTI-SPOOFING ---
        security: {
            domainLock: false, // Disabled for Preview Mode so the demo works anywhere

            // IMPORTANT: Add your actual domains here (www.domain.com). "localhost" and "127.0.0.1" are kept for local testing.
            // Leaving it empty "" handles users opening it directly from a local file:// URL.
            allowedDomains: ["localhost", "127.0.0.1", "slate.zavieray.my.id"], 
            spoofWarning: true,
            officialUrl: "https://github.com/javierrayhan/SlateLink" 
        },

        // --- VERIFIED BADGE ---
        verified: true, 

        // --- THEME ENGINE ---
        theme: {
            defaultTheme: "dark", 
            toggleEnabled: true,  
            toggleStyle: "switch", 
            togglePosition: "top-left", 
        },
        
        // --- SHARE ENGINE ---
        share: {
            enabled: true, 
            position: "top-right",
            title: "SlateLink | Minimalist Biolink Demo",
            text: "Check out the SlateLink developer profile template!"
        },

        // --- ACCESSIBILITY ---
        accessibility: {
            reducedMotion: false 
        }
    },

    // -----------------------------------------
    // 3. TAB CONTENT DATA
    // -----------------------------------------
    preview: [
        { title: "Get the Source Code", desc: "Star the repo on GitHub", icon: "github-logo", url: "https://github.com/javierrayhan/SlateLink", highlighted: true},
        { title: "Documentation (Soon)", desc: "How to setup your own SlateLink", icon: "book-open", url: "https://docs.javierrayhan.my.id", highlighted: false },
        { title: "Report a Bug", desc: "Help us improve the experience", icon: "bug", url: "https://github.com/javierrayhan/SlateLink/issues", highlighted: false }
    ],

    feature: [
        {
            category: "Core Capabilities",
            items: [
                { title: "Zero-Trust Security", desc: "Built-in domain locking & spoof detection", icon: "shield-check", url: "#" },
                { title: "Typographic Granularity", desc: "Full control over weights and families", icon: "text-t", url: "#" },
                { title: "Dynamic Theming", desc: "Buttery smooth light and dark modes", icon: "swatches", url: "#" },
            ]
        }
    ]
};