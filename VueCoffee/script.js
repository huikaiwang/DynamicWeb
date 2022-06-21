var vm = new Vue({
  el: "#app",
  data: {
    editing: false,
    cupTypes: ['small','medium','big','mock'],
    coffees: [
      {name: "Expresso",
       coffee: 80,bubble: 0,water: 0,milk: 0,type: "small"},
      {name: "Americano",
       coffee: 40,bubble: 0,water: 40,milk: 0},
      {name: "Cappuccino",
       coffee: 40,bubble: 0,water: 0,milk: 50,type:"big"},
      {name: "Latte",
       coffee: 30,bubble: 30,water: 0,milk: 30}
    ],
    favoriteType: "Cappuccino"
  }
})