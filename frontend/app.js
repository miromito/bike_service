const Home = {
    template: `
        <div class="text-center mt-5">
            <h1>Welcome to Bike Service</h1>
            <p class="lead">
                Your trusted partner for bike repairs and maintenance. We provide high-quality services to keep your bike running smoothly.
            </p>
            <p>
                Use the navigation menu above to manage clients, employees, services, and orders.
            </p>
            <img src="logo.webp" alt="Bike Service" class="img-fluid logo-small mt-4">
        </div>
    `
};


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
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in services" :key="service.id">
                        <td>
                            <span v-if="!isEditing(service.id)">{{ service.name }}</span>
                            <input v-if="isEditing(service.id)" v-model="editingService.name" type="text" class="form-control">
                        </td>
                        <td>
                            <span v-if="!isEditing(service.id)">{{ service.price }}</span>
                            <input v-if="isEditing(service.id)" v-model="editingService.price" type="number" step="0.01" class="form-control">
                        </td>
                        <td>
                            <button v-if="!isEditing(service.id)" @click="startEditing(service)" class="btn btn-warning btn-sm">Edit</button>
                            <button v-if="isEditing(service.id)" @click="saveEdit(service.id)" class="btn btn-success btn-sm">Save</button>
                            <button @click="deleteService(service.id)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
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
                    <label class="form-label">Price</label>
                    <input v-model="newService.price" type="number" step="0.01" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Service</button>
            </form>
        </div>
    `,
    data() {
        return {
            services: [], // List of all services
            newService: {name: "", price: 0}, // New service object for the form
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
        async fetchServices() {
            try {
                const response = await fetch("http://127.0.0.1:8000/services/");
                this.services = await response.json();
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        },
        async addService() {
            try {
                const response = await fetch("http://127.0.0.1:8000/services/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.newService),
                });
                if (response.ok) {
                    this.newService = { name: "", price: 0 }; // Clear form
                    this.fetchServices();
                }
            } catch (error) {
                console.error("Error adding service:", error);
            }
        },
        async deleteService(serviceId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/services/${serviceId}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    this.fetchServices();
                }
            } catch (error) {
                console.error("Error deleting service:", error);
            }
        },
        startEditing(service) {
            this.editingService = { ...service };
        },
        isEditing(serviceId) {
            return this.editingService && this.editingService.id === serviceId;
        },
        async saveEdit(serviceId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/services/${serviceId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.editingService),
                });
                if (response.ok) {
                    this.editingService = null; // Exit editing mode
                    this.fetchServices();
                }
            } catch (error) {
                console.error("Error saving service:", error);
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
                        <th>Price</th>
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
                            <span>{{ getServicePrice(order.service_id) }}</span>
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
                            <button @click="generateInvoice(order)" class="btn btn-primary btn-sm">Generate Invoice</button>
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

            <button @click="generateTotalReport" class="btn btn-success mt-3">Generate Total Report</button>
        </div>
    `,
    data() {
        return {
            orders: [],
            clients: [],
            services: [],
            employees: [],
            newOrder: {client_id: "", service_id: "", employee_id: "", date: ""},
            editingOrder: null,
            errorMessage: "",
            searchQuery: ""
        };
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(order =>
                order.id.toString().includes(this.searchQuery)
            );
        }
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await fetch("http://127.0.0.1:8000/orders/");
                if (response.ok) {
                    this.orders = await response.json();
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
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
            try {
                const response = await fetch("http://127.0.0.1:8000/orders/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.newOrder)
                });
                if (response.ok) {
                    this.newOrder = {client_id: "", service_id: "", employee_id: "", date: ""};
                    this.fetchOrders();
                }
            } catch (error) {
                console.error("Error adding order:", error);
            }
        },
        async deleteOrder(orderId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
                    method: "DELETE"
                });
                if (!response.ok) {
                    const error = await response.json();
                    this.errorMessage = error.detail;
                } else {
                    this.errorMessage = "";
                    this.fetchOrders();
                }
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        },
        startEditing(order) {
            this.editingOrder = {...order};
        },
        isEditing(orderId) {
            return this.editingOrder && this.editingOrder.id === orderId;
        },
        async saveEdit(orderId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.editingOrder)
                });
                if (response.ok) {
                    this.editingOrder = null;
                    this.fetchOrders();
                }
            } catch (error) {
                console.error("Error saving edits:", error);
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
        getServicePrice(serviceId) {
            const service = this.services.find(s => s.id === serviceId);
            return service ? service.price : "0.00";
        },
        getEmployeeName(employeeId) {
            const employee = this.employees.find(e => e.id === employeeId);
            return employee ? employee.name : "Unknown";
        },
        async generateInvoice(orderId) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}/invoice`);
                const orderDetails = await response.json();

                const newWindow = window.open("", "_blank");
                newWindow.document.write(`
                    <html>
                    <head>
                        <title>Invoice</title>
                    </head>
                    <body>
                        <h2>Invoice for Order ID: ${orderDetails["Order ID"]}</h2>
                        <table border="1" cellpadding="5" cellspacing="0">
                            <tr><th>Client</th><td>${orderDetails.Client}</td></tr>
                            <tr><th>Service</th><td>${orderDetails.Service}</td></tr>
                            <tr><th>Price</th><td>${orderDetails.Price}</td></tr>
                            <tr><th>Employee</th><td>${orderDetails.Employee}</td></tr>
                            <tr><th>Date</th><td>${orderDetails.Date}</td></tr>
                        </table>
                    </body>
                    </html>
                `);
                newWindow.document.close();
            } catch (error) {
                console.error("Error generating invoice:", error);
            }
        },
        generateTotalReport() {
            fetch("http://127.0.0.1:8000/orders/report", {
                method: "GET"
            })
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "total_report.csv";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
                .catch(error => {
                    console.error("Error generating report:", error);
                });
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
            currentView: "Home"
        };
    },
    components: {Home, Clients, Employees, Services, Orders}
});

app.mount("#app");
