const { createApp } = Vue;

createApp({
  data() {
    return {
      districts: ["jhargram", "kolkata"],
      district: localStorage.getItem("district") || "",

      buses: [],
      stops: [],

      from: "",
      to: "",
      bus: "",

      fromList: [],
      toList: [],
      showFrom: false,
      showTo: false
    };
  },

  mounted() {
    if (this.district) this.loadData();
  },

  methods: {

    async loadData() {
      localStorage.setItem("district", this.district);

      const res = await fetch(`my_data/${this.district}.json`);
      const data = await res.json();

      this.buses = data.buses;

      const set = new Set();
      this.buses.forEach(b => {
        b.stops.forEach(s => set.add(s.name));
      });

      this.stops = [...set];
    },

    filterStops(type) {
      const val = (type === "from" ? this.from : this.to).toLowerCase();

      if (val.length < 2) return;

      const list = this.stops.filter(s => s.toLowerCase().includes(val));

      if (type === "from") {
        this.fromList = list;
        this.showFrom = true;
      } else {
        this.toList = list;
        this.showTo = true;
      }
    },

    select(type, val) {
      if (type === "from") {
        this.from = val;
        this.showFrom = false;
      } else {
        this.to = val;
        this.showTo = false;
      }
    },

    swap() {
      [this.from, this.to] = [this.to, this.from];
    },

    submitForm() {
      if (this.bus) {
        location.href = `my_data/bus.html?bus=${this.bus}&d=${this.district}`;
        return;
      }

      location.href = `my_data/results.html?from=${this.from}&to=${this.to}&d=${this.district}`;
    }
  }
}).mount("#app");
