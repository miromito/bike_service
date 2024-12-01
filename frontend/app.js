const app = Vue.createApp({
    data() {
        return {
            clients: [],
            newClient: {
                name: "",
                phone_number: ""
            }
        };
    },
    methods: {
        async fetchClients() {
            try {
                const response = await fetch("http://127.0.0.1:8000/clients/");
                this.clients = await response.json();
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        },
        async addClient() {
            try {
                const response = await fetch("http://127.0.0.1:8000/clients/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.newClient)
                });

                if (response.ok) {
                    this.newClient.name = "";
                    this.newClient.phone_number = "";
                    this.fetchClients(); // Refresh the list
                } else {
                    console.error("Error adding client:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding client:", error);
            }
        }
    },
    mounted() {
        this.fetchClients();
    }
});

app.mount("#app");
