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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(client, index) in clients" :key="client.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ client.name }}</td>
                        <td>{{ client.phone_number }}</td>
                        <td>
                            <button @click="deleteClient(client.id)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

            <h3>Add Client</h3>
            <form @submit.prevent="addClient">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input v-model="newClient.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone Number</label>
                    <input v-model="newClient.phone_number" type="number" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Client</button>
            </form>
        </div>
    `,
    data() {
        return {
            clients: [],
            newClient: {name: "", phone_number: ""},
            errorMessage: ""
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
        },
        async deleteClient(clientId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/clients/${clientId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    const error = await response.json();
                    this.errorMessage = error.detail; // Set the error message
                } else {
                    this.errorMessage = ""; // Clear the error message on success
                    this.fetchClients();
                }
            } catch (error) {
                console.error("Error deleting client:", error);
                this.errorMessage = "An unexpected error occurred while deleting the client.";
            }
        }


    },
    mounted() {
        this.fetchClients();
    }
};

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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(employee, index) in employees" :key="employee.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ employee.name }}</td>
                        <td>{{ employee.position }}</td>
                        <td>
                            <button @click="deleteEmployee(employee.id)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
           
            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

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
            newEmployee: {name: "", position: ""},
            errorMessage: ""
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
        },
        async deleteEmployee(employeeId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/employees/${employeeId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    const error = await response.json();
                    this.errorMessage = error.detail; // Set the error message
                } else {
                    this.fetchEmployees();
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
                alert("An unexpected error occurred while deleting the employee.");
            }
        }
    },
    mounted() {
        this.fetchEmployees();
    }
};

const Services = {
    template: `
        <div>
            <h2>Services</h2>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(service, index) in services" :key="service.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ service.name }}</td>
                        <td>
                            <button @click="deleteService(service.id)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

            <h3>Add Service</h3>
            <form @submit.prevent="addService">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input v-model="newService.name" type="text" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Service</button>
            </form>
        </div>
    `,
    data() {
        return {
            services: [],
            newService: {name: ""},
            errorMessage: ""
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
                this.newService = {name: ""};
                this.fetchServices();
            }
        },
        async deleteService(serviceId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/services/${serviceId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    const error = await response.json();
                    this.errorMessage = error.detail; // Set the error message
                } else {
                    this.fetchServices();
                }
            } catch (error) {
                console.error("Error deleting service:", error);
                alert("An unexpected error occurred while deleting the service.");
            }
        }
    },
    mounted() {
        this.fetchServices();
    }
};

const Orders = {
    template: `
        <div>
            <h2>Orders</h2>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>{{ getClientName(order.client_id) }}</td>
                        <td>{{ getServiceName(order.service_id) }}</td>
                        <td>{{ getEmployeeName(order.employee_id) }}</td>
                        <td>{{ order.date }}</td>
                        <td>
                            <button @click="deleteOrder(order.id)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3>Add Order</h3>
            <form @submit.prevent="addOrder">
                <div class="mb-3">
                    <label class="form-label">Client</label>
                    <select v-model="newOrder.client_id" class="form-select" required>
                        <option v-for="client in clients" :value="client.id">{{ client.name }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Service</label>
                    <select v-model="newOrder.service_id" class="form-select" required>
                        <option v-for="service in services" :value="service.id">{{ service.name }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Employee</label>
                    <select v-model="newOrder.employee_id" class="form-select" required>
                        <option v-for="employee in employees" :value="employee.id">{{ employee.name }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input v-model="newOrder.date" type="date" class="form-control" required>
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
            employees: [],
            newOrder: {client_id: "", service_id: "", employee_id: "", date: ""}
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
        async fetchEmployees() {
            const response = await fetch("http://127.0.0.1:8000/employees/");
            this.employees = await response.json();
        },
        async addOrder() {
            const response = await fetch("http://127.0.0.1:8000/orders/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.newOrder)
            });
            if (response.ok) {
                this.newOrder = {client_id: "", service_id: "", employee_id: "", date: ""};
                this.fetchOrders();
            }
        },
        async deleteOrder(orderId) {
            const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
                method: "DELETE",
            });
            if (response.ok) {
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
        },
        getEmployeeName(employeeId) {
            const employee = this.employees.find(e => e.id === employeeId);
            return employee ? employee.name : "Unknown";
        }
    },
    mounted() {
        this.fetchOrders();
        this.fetchClients();
        this.fetchServices();
        this.fetchEmployees();
    }
};

const app = Vue.createApp({
    data() {
        return {
            currentView: "Clients"
        };
    },
    components: {Clients, Employees, Services, Orders}
});

app.mount("#app");
