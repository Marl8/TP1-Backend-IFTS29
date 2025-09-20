class DeliveryOrder {
    #id;
    #customerId;
    #items;
    #status;
    #total;
    //#assignedRiderId;
    #estimatedTime;
    #plataforma;  

    constructor(id, customerId, total, status = 'preparing', plataforma = 'Propia') {
        this.#id = id;
        this.#customerId = customerId;
        this.#status = status;
        this.#total = total;
        this.#items = [];
        this.#plataforma = plataforma;  // Valor por defecto 'Propia'
    }

    getId() { 
        return this.#id; 
    }

    getCustomerId() { 
        return this.#customerId;
    }

    setCustomerId(customerId) { 
        this.#customerId = customerId;
    }

    getStatus() { 
        return this.#status; 
    }

    setStatus(status) { 
        this.#status = status; 
    }

    getTotal() { 
        return this.#total; 
    }

    setTotal(total) { 
        this.#total = total; 
    }

    getEstimatedTime() { 
        return this.#estimatedTime; 
    }

    setEstimatedTime(estimatedTime) { 
        this.#estimatedTime = estimatedTime; 
    }

    setItems(items) {
        this.#items = items;
    }

    removeItem(index) { 
        this.#items.splice(index, 1); 
    }
    
    getItems() { 
        return [...this.#items]; 
    }

    // Métodos para obtener y setear la plataforma
    getPlataforma() {
        return this.#plataforma;
    }

    setPlataforma(plataforma) {
        this.#plataforma = plataforma;
    }

    // Método para convertir el objeto a JSON
    toJSON() {
        return {
            id: this.#id,
            customerId: this.#customerId,
            items: this.#items,
            status: this.#status,
            total: this.#total,
            estimatedTime: this.#estimatedTime,
            plataforma: this.#plataforma  
        };
    }
}

module.exports = DeliveryOrder;


