
class DeliveryOrder {
    #id;
    #customerId;
    #items;
    #status;
    #total;
    //#assignedRiderId;
    #estimatedTime;

    constructor(id, customerId, total, status = 'preparing') {
        this.#id = id;
        this.#customerId = customerId;
        //this.#assignedRiderId = assignedRiderId;
        this.#status = status;
        this.#total = total;
        this.#items = [];
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

    /*
    getAssignedRiderId() { 
        return this.#assignedRiderId; 
    }

    setAssignedRiderId(assignedRiderId) { 
        this.#assignedRiderId = assignedRiderId; 
    }
    */    

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

     toJSON() {
        return {
            id: this.#id,
            customerId: this.#customerId,
            items: this.#items,
            status: this.#status,
            total: this.#total,
            estimatedTime: this.#estimatedTime
            
        };
    }
}

module.exports = DeliveryOrder;