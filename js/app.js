"use strict";
class AlarmApp {

    constructor(container, options) {
        this.container = document.querySelector(container);

        this.default = {
            "storeName": "alarmApp"
        };
        this.options = { ...this.default, ...options }; //merge

        // FORM
        this.createForm = this.container.querySelector('.create-form');
        this.modalButton = this.container.querySelector('.modal-button');
        this.nameInput = this.container.querySelector('.form-name');
        this.dateInput = this.container.querySelector('.form-date');
        this.createButton = this.container.querySelector('.create-button');
        // FORM

        // LİST
        this.listWrapper = this.container.querySelector('.alarm-list');
        // LİST

        this.timer = null;
        this.init();
    }

    validStore() {
        return localStorage.getItem(this.options.storeName) ? JSON.parse(localStorage.getItem(this.options.storeName)) : [];
    }

    createView(item) {
        const _this = this;

        // WRAPPER DIV
        const wrapper = document.createElement('div');
        wrapper.className = `text-left bg-gradient-to-br from-blue-800 to slate-500  w-96 p-2 rounded-lg mb-2 ${!item.active?'bg-gray-500':''}`;

        // TEXT AREA
        const nameText = document.createElement('h1');
        nameText.className = `text-white`;
        nameText.innerHTML = `${item.name}`;
        const dateText = document.createElement('p');
        dateText.className = `text-white text-2xl`;
        dateText.innerHTML = `Alarm Tarihi: ${item.date}`;


        // DELETE BUTTON
        const deleteButton = document.createElement('button');
        deleteButton.className = `text-white w-full text-right text-xl cursor-pointer`;
        deleteButton.dataset.date = item.date;
        deleteButton.innerHTML = "Sil";
        deleteButton.addEventListener('click', () => {
            let alarms = this.validStore();

            alarms = alarms.filter(i => i.date != item.date);
            localStorage.setItem(this.options.storeName, JSON.stringify(alarms));

            this.updateList();
        });

        wrapper.appendChild(nameText);
        wrapper.appendChild(dateText);
        wrapper.appendChild(deleteButton);

        this.listWrapper.appendChild(wrapper);

    }

    updateList() {
        let localStorageAlarms = this.validStore();
        if (localStorageAlarms) {
            this.listWrapper.innerHTML = "";

            localStorageAlarms.forEach(item => {
                this.createView(item);
            });
        }
    }

    createItem() {
        let alarmDate = this.dateInput.value;
        let alarmName = this.nameInput.value;
        if (!alarmDate) {
            alert("Tarih alanı boş bırakılamaz");
            return;
        }

        const alarms = this.validStore();
        const item = {
            "id": 0,
            "name": alarmName,
            "date": alarmDate,
            "active":true
        };

        alarms.push(item);
        localStorage.setItem(this.options.storeName, JSON.stringify(alarms));

        this.updateList();
    }

    checkAlarm() {
        let alarmList = this.validStore();
        
        if (alarmList) {
            
            for (let i = 0,length=alarmList.length; i < length; i++) {
                const item = alarmList[i];
                if ( new Date() >= new Date(item.date) && item.active) {
                    console.log(item.name+" Alarmı Çalıyor");
                    item.active=false;
                } 
            }
            localStorage.setItem(this.options.storeName,JSON.stringify(alarmList));
            this.updateList();
        }
    }

    init() {
        const _this = this;

        this.modalButton.addEventListener('click', () => {
            this.createForm.classList.toggle("hidden");
        });
        this.createButton.addEventListener('click', () => this.createItem());

        this.timer = setInterval(() => {
            _this.checkAlarm();
        }, 1000);

        this.updateList();
    }

}
document.addEventListener('DOMContentLoaded', () => {
    const alarm = new AlarmApp('.alarm-area', {

    });
});