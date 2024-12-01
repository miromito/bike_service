// Clients Component
const Clients = {
    template: `
        <div>
            <h2>Clients</h2>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="client.id" v-for="(client, index) in clients">
                        <td>{{ index + 1 }}</td>
                        <td>{{ client.name }}</td>
                        <td>{{ client.phone_number }}</td>
                    </tr>
                </tbody>
            </table>

            <h3>Add Client</h3>
            <form @submit.prevent="addClient">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input v-model="newClient.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone Number</label>
                    <input v-model="newClient.phone_number" type="text" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Client</button>
            </form>
        </div>
    `,
    data() {
        return {
            clients: [],
            newClient: {name: "", phone_number: ""}
        };
    },
    methods: {
        async fetchClients() {
            const response = await fetch("http://127.0.0.1:8000/clients/");
            this.clients = await response.json();
        },
        async addClient() {
            const response = await fetch("http://127.0.0.1:8000/clients/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.newClient)
            });
            if (response.ok) {
                this.newClient = {name: "", phone_number: ""};
                this.fetchClients();
            }
        }
    },
    mounted() {
        this.fetchClients();
    }
};

// Employees Component
const Employees = {
    template: `
        <div>
            <h2>Employees</h2>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Position</th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="employee.id" v-for="(employee, index) in employees">
                        <td>{{ index + 1 }}</td>
                        <td>{{ employee.name }}</td>
                        <td>{{ employee.position }}</td>
                    </tr>
                </tbody>
            </table>

            <h3>Add Employee</h3>
            <form @submit.prevent="addEmployee">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input v-model="newEmployee.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Position</label>
                    <input v-model="newEmployee.position" type="text" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Employee</button>
            </form>
        </div>
    `,
    data() {
        return {
            employees: [],
            newEmployee: {name: "", position: ""}
        };
    },
    methods: {
        async fetchEmployees() {
            const response = await fetch("http://127.0.0.1:8000/employees/");
            this.employees = await response.json();
        },
        async addEmployee() {
            const response = await fetch("http://127.0.0.1:8000/employees/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.newEmployee)
            });
            if (response.ok) {
                this.newEmployee = {name: "", position: ""};
                this.fetchEmployees();
            }
        }
    },
    mounted() {
        this.fetchEmployees();
    }
};

// Services Component
const Services = {
    template: `
        <div>
            <h2>Services</h2>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="service.id" v-for="(service, index) in services">
                        <td>{{ index + 1 }}</td>
                        <td>{{ service.name }}</td>
                        <td>{{ service.description }}</td>
                        <td>{{ service.price }}</td>
                    </tr>
                </tbody>
            </table>

            <h3>Add Service</h3>
            <form @submit.prevent="addService">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input v-model="newService.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <input v-model="newService.description" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Price</label>
                    <input v-model="newService.price" type="number" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Service</button>
            </form>
        </div>
    `,
    data() {
        return {
            services: [],
            newService: {name: "", description: "", price: 0}
        };
    },
    methods: {
        async fetchServices() {
            const response = await fetch("http://127.0.0.1:8000/services/");
            this.services = await response.json();
        },
        async addService() {
            const response = await fetch("http://127.0.0.1:8000/services/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.newService)
            });
            if (response.ok) {
                this.newService = {name: "", description: "", price: 0};
                this.fetchServices();
            }
        }
    },
    mounted() {
        this.fetchServices();
    }
};

// Orders Component
const Orders = {
    template: `
        <div>
            <h2>Orders</h2>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="order.id" v-for="(order, index) in orders">
                        <td>{{ index + 1 }}</td>
                        <td>{{ getClientName(order.client_id) }}</td>
                        <td>{{ getServiceName(order.service_id) }}</td>
                        <td>{{ order.date }}</td>
                        <td>{{ order.status }}</td>
                    </tr>
                </tbody>
            </table>

            <h3>Add Order</h3>
            <form @submit.prevent="addOrder">
                <div class="mb-3">
                    <label class="form-label">Client</label>
                    <select v-model="newOrder.client_id" class="form-select" required>
                        <option v-for="client in clients" :value="client.id" :key="client.id">
                            {{ client.name }}
                        </option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Service</label>
                    <select v-model="newOrder.service_id" class="form-select" required>
                        <option v-for="service in services" :value="service.id" :key="service.id">
                            {{ service.name }}
                        </option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input v-model="newOrder.date" type="datetime-local" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Status</label>
                    <input v-model="newOrder.status" type="text" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Order</button>
            </form>
        </div>
    `,
    data() {
        return {
            orders: [],
            clients: [],
            services: [],
            newOrder: {client_id: "", service_id: "", date: "", status: "Pending"}
        };
    },
    methods: {
        async fetchOrders() {
            const response = await fetch("http://127.0.0.1:8000/orders/");
            this.orders = await response.json();
        },
        async fetchClients() {
            const response = await fetch("http://127.0.0.1:8000/clients/");
            this.clients = await response.json();
        },
        async fetchServices() {
            const response = await fetch("http://127.0.0.1:8000/services/");
            this.services = await response.json();
        },
        async addOrder() {
            const response = await fetch("http://127.0.0.1:8000/orders/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.newOrder)
            });
            if (response.ok) {
                this.newOrder = {client_id: "", service_id: "", date: "", status: "Pending"};
                this.fetchOrders();
            }
        },
        getClientName(clientId) {
            const client = this.clients.find(c => c.id === clientId);
            return client ? client.name : "Unknown";
        },
        getServiceName(serviceId) {
            const service = this.services.find(s => s.id === serviceId);
            return service ? service.name : "Unknown";
        }
    },
    mounted() {
        this.fetchOrders();
        this.fetchClients();
        this.fetchServices();
    }
};


// Vue App Initialization
const app = Vue.createApp({
    data() {
        return {
            currentView: Clients
        };
    },
    components: {Clients, Employees, Services, Orders}
});

app.mount("#app");
