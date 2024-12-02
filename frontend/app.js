const Clients = {
    template: `
        <div>
            <h2>Clients</h2>
            <!-- Search Field -->
            <input
                v-model="searchQuery"
                type="text"
                class="form-control mb-3"
                placeholder="Search by name"
            />

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
                    <tr v-for="(client, index) in filteredClients" :key="client.id">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <span v-if="!isEditing(client.id)">{{ client.name }}</span>
                            <input v-if="isEditing(client.id)" v-model="editingClient.name" type="text" class="form-control">
                        </td>
                        <td>
                            <span v-if="!isEditing(client.id)">{{ client.phone_number }}</span>
                            <input v-if="isEditing(client.id)" v-model="editingClient.phone_number" type="text" class="form-control">
                        </td>
                        <td>
                            <button v-if="!isEditing(client.id)" @click="startEditing(client)" class="btn btn-warning btn-sm">Edit</button>
                            <button v-if="isEditing(client.id)" @click="saveEdit(client.id)" class="btn btn-success btn-sm">Save</button>
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
            clients: [], // List of all clients
            newClient: {name: "", phone_number: ""}, // New client object for the form
            editingClient: null, // Object being edited
            errorMessage: "", // Error messages
            searchQuery: "" // Search input value
        };
    },
    computed: {
        // Filter clients based on the search query
        filteredClients() {
            return this.clients.filter(client =>
                client.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        // Fetch clients from the backend
        async fetchClients() {
            try {
                const response = await fetch("http://127.0.0.1:8000/clients/");
                if (response.ok) {
                    this.clients = await response.json();
                } else {
                    console.error("Error fetching clients:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        },
        // Add a new client
        async addClient() {
            try {
                const response = await fetch("http://127.0.0.1:8000/clients/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.newClient)
                });
                if (response.ok) {
                    this.newClient = {name: "", phone_number: ""}; // Clear the form
                    this.fetchClients(); // Refresh the list
                } else {
                    console.error("Error adding client:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding client:", error);
            }
        },
        // Delete a client
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
        },
        // Start editing a client
        startEditing(client) {
            this.editingClient = {...client}; // Clone the client object
        },
        // Check if a specific client is being edited
        isEditing(clientId) {
            return this.editingClient && this.editingClient.id === clientId;
        },
        // Save edits to the backend
        async saveEdit(clientId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/clients/${clientId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.editingClient),
                });
                if (response.ok) {
                    this.editingClient = null; // Clear the editing client
                    this.fetchClients();
                } else {
                    console.error("Error saving edits:", response.statusText);
                }
            } catch (error) {
                console.error("Error saving edits:", error);
            }
        },
    },
    mounted() {
        this.fetchClients();
    }
};

const Employees = {
    template: `
        <div>
            <h2>Employees</h2>
            <!-- Search Field -->
            <input
                v-model="searchQuery"
                type="text"
                class="form-control mb-3"
                placeholder="Search by name"
            />

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
                    <tr v-for="(employee, index) in filteredEmployees" :key="employee.id">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <span v-if="!isEditing(employee.id)">{{ employee.name }}</span>
                            <input v-if="isEditing(employee.id)" v-model="editingEmployee.name" type="text" class="form-control">
                        </td>
                        <td>
                            <span v-if="!isEditing(employee.id)">{{ employee.position }}</span>
                            <input v-if="isEditing(employee.id)" v-model="editingEmployee.position" type="text" class="form-control">
                        </td>
                        <td>
                            <button v-if="!isEditing(employee.id)" @click="startEditing(employee)" class="btn btn-warning btn-sm">Edit</button>
                            <button v-if="isEditing(employee.id)" @click="saveEdit(employee.id)" class="btn btn-success btn-sm">Save</button>
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
            employees: [], // List of all employees
            newEmployee: {name: "", position: ""}, // New employee object for the form
            editingEmployee: null, // Object being edited
            errorMessage: "", // Error messages
            searchQuery: "" // Search input value
        };
    },
    computed: {
        // Filter employees based on the search query
        filteredEmployees() {
            return this.employees.filter(employee =>
                employee.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        // Fetch employees from the backend
        async fetchEmployees() {
            try {
                const response = await fetch("http://127.0.0.1:8000/employees/");
                if (response.ok) {
                    this.employees = await response.json();
                } else {
                    console.error("Error fetching employees:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        },
        // Add a new employee
        async addEmployee() {
            try {
                const response = await fetch("http://127.0.0.1:8000/employees/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.newEmployee)
                });
                if (response.ok) {
                    this.newEmployee = {name: "", position: ""}; // Clear the form
                    this.fetchEmployees(); // Refresh the list
                } else {
                    console.error("Error adding employee:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding employee:", error);
            }
        },
        // Delete an employee
        async deleteEmployee(employeeId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/employees/${employeeId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    const error = await response.json();
                    this.errorMessage = error.detail; // Set the error message
                } else {
                    this.errorMessage = ""; // Clear the error message on success
                    this.fetchEmployees();
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
                this.errorMessage = "An unexpected error occurred while deleting the employee.";
            }
        },
        // Start editing an employee
        startEditing(employee) {
            this.editingEmployee = {...employee}; // Clone the employee object
        },
        // Check if a specific employee is being edited
        isEditing(employeeId) {
            return this.editingEmployee && this.editingEmployee.id === employeeId;
        },
        // Save edits to the backend
        async saveEdit(employeeId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/employees/${employeeId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.editingEmployee),
                });
                if (response.ok) {
                    this.editingEmployee = null; // Clear the editing employee
                    this.fetchEmployees();
                } else {
                    console.error("Error saving edits:", response.statusText);
                }
            } catch (error) {
                console.error("Error saving edits:", error);
            }
        },
    },
    mounted() {
        this.fetchEmployees();
    }
};

const Services = {
    template: `
        <div>
            <h2>Services</h2>
            <!-- Search Field -->
            <input
                v-model="searchQuery"
                type="text"
                class="form-control mb-3"
                placeholder="Search by name"
            />

            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(service, index) in filteredServices" :key="service.id">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <span v-if="!isEditing(service.id)">{{ service.name }}</span>
                            <input v-if="isEditing(service.id)" v-model="editingService.name" type="text" class="form-control">
                        </td>
                        <td>
                            <button v-if="!isEditing(service.id)" @click="startEditing(service)" class="btn btn-warning btn-sm">Edit</button>
                            <button v-if="isEditing(service.id)" @click="saveEdit(service.id)" class="btn btn-success btn-sm">Save</button>
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
            services: [], // List of all services
            newService: {name: ""}, // New service object for the form
            editingService: null, // Object being edited
            errorMessage: "", // Error messages
            searchQuery: "" // Search input value
        };
    },
    computed: {
        // Filter services based on the search query
        filteredServices() {
            return this.services.filter(service =>
                service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        // Fetch services from the backend
        async fetchServices() {
            try {
                const response = await fetch("http://127.0.0.1:8000/services/");
                if (response.ok) {
                    this.services = await response.json();
                } else {
                    console.error("Error fetching services:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        },
        // Add a new service
        async addService() {
            try {
                const response = await fetch("http://127.0.0.1:8000/services/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.newService)
                });
                if (response.ok) {
                    this.newService = {name: ""}; // Clear the form
                    this.fetchServices(); // Refresh the list
                } else {
                    console.error("Error adding service:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding service:", error);
            }
        },
        // Delete a service
        async deleteService(serviceId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/services/${serviceId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    const error = await response.json();
                    this.errorMessage = error.detail; // Set the error message
                } else {
                    this.errorMessage = ""; // Clear the error message on success
                    this.fetchServices();
                }
            } catch (error) {
                console.error("Error deleting service:", error);
                this.errorMessage = "An unexpected error occurred while deleting the service.";
            }
        },
        // Start editing a service
        startEditing(service) {
            this.editingService = {...service}; // Clone the service object
        },
        // Check if a specific service is being edited
        isEditing(serviceId) {
            return this.editingService && this.editingService.id === serviceId;
        },
        // Save edits to the backend
        async saveEdit(serviceId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/services/${serviceId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.editingService),
                });
                if (response.ok) {
                    this.editingService = null; // Clear the editing service
                    this.fetchServices();
                } else {
                    console.error("Error saving edits:", response.statusText);
                }
            } catch (error) {
                console.error("Error saving edits:", error);
            }
        },
    },
    mounted() {
        this.fetchServices();
    }
};

const Orders = {
    template: `
        <div>
            <h2>Orders</h2>
            <!-- Search Field -->
            <input
                v-model="searchQuery"
                type="text"
                class="form-control mb-3"
                placeholder="Search by Order ID"
            />

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
                    <tr v-for="order in filteredOrders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>
                            <span v-if="!isEditing(order.id)">{{ getClientName(order.client_id) }}</span>
                            <select v-if="isEditing(order.id)" v-model="editingOrder.client_id" class="form-select">
                                <option v-for="client in clients" :value="client.id">{{ client.name }}</option>
                            </select>
                        </td>
                        <td>
                            <span v-if="!isEditing(order.id)">{{ getServiceName(order.service_id) }}</span>
                            <select v-if="isEditing(order.id)" v-model="editingOrder.service_id" class="form-select">
                                <option v-for="service in services" :value="service.id">{{ service.name }}</option>
                            </select>
                        </td>
                        <td>
                            <span v-if="!isEditing(order.id)">{{ getEmployeeName(order.employee_id) }}</span>
                            <select v-if="isEditing(order.id)" v-model="editingOrder.employee_id" class="form-select">
                                <option v-for="employee in employees" :value="employee.id">{{ employee.name }}</option>
                            </select>
                        </td>
                        <td>
                            <span v-if="!isEditing(order.id)">{{ order.date }}</span>
                            <input v-if="isEditing(order.id)" v-model="editingOrder.date" type="date" class="form-control">
                        </td>
                        <td>
                            <button v-if="!isEditing(order.id)" @click="startEditing(order)" class="btn btn-warning btn-sm">Edit</button>
                            <button v-if="isEditing(order.id)" @click="saveEdit(order.id)" class="btn btn-success btn-sm">Save</button>
                            <button @click="deleteOrder(order.id)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

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
            orders: [], // List of all orders
            clients: [], // List of all clients
            services: [], // List of all services
            employees: [], // List of all employees
            newOrder: {client_id: "", service_id: "", employee_id: "", date: ""}, // New order form object
            editingOrder: null, // Object being edited
            errorMessage: "", // Error messages
            searchQuery: "" // Search input value
        };
    },
    computed: {
        // Filter orders based on the search query (Order ID)
        filteredOrders() {
            return this.orders.filter(order =>
                order.id.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        // Fetch orders from the backend
        async fetchOrders() {
            try {
                const response = await fetch("http://127.0.0.1:8000/orders/");
                if (response.ok) {
                    this.orders = await response.json();
                } else {
                    console.error("Error fetching orders:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        },
        // Fetch related data (clients, services, employees)
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
        // Add a new order
        async addOrder() {
            try {
                const response = await fetch("http://127.0.0.1:8000/orders/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.newOrder)
                });
                if (response.ok) {
                    this.newOrder = {client_id: "", service_id: "", employee_id: "", date: ""}; // Clear the form
                    this.fetchOrders(); // Refresh the list
                } else {
                    console.error("Error adding order:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding order:", error);
            }
        },
        // Delete an order
        async deleteOrder(orderId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    const error = await response.json();
                    this.errorMessage = error.detail; // Set the error message
                } else {
                    this.errorMessage = ""; // Clear the error message on success
                    this.fetchOrders();
                }
            } catch (error) {
                console.error("Error deleting order:", error);
                this.errorMessage = "An unexpected error occurred while deleting the order.";
            }
        },
        // Start editing an order
        startEditing(order) {
            this.editingOrder = {...order}; // Clone the order object
        },
        // Check if a specific order is being edited
        isEditing(orderId) {
            return this.editingOrder && this.editingOrder.id === orderId;
        },
        // Save edits to the backend
        async saveEdit(orderId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.editingOrder),
                });
                if (response.ok) {
                    this.editingOrder = null; // Clear the editing order
                    this.fetchOrders();
                } else {
                    console.error("Error saving edits:", response.statusText);
                }
            } catch (error) {
                console.error("Error saving edits:", error);
            }
        },
        // Utility functions to get names for client, service, and employee
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
