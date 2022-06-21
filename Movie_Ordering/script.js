// clear後 json的qty有問題

var vm = new Vue({
    el:"#app",
    data:{
      checkOut: false,
      isCartOpen: false,
      movies:[],
      cart:[],
      currentMovie: null,
      quantity:0,
      keyword:"",
      editing: false,
    },
    created(){
      let apiUrl="movie.json"
      axios.get(apiUrl).then(res=>{
        this.movies=res.data
      })
    },
    methods:{
      bgcss(url){
        return {
          'background-image':'url('+url+')',
          'background-position':'center center',
          'background-size':"cover"        
        }
      },
      wheel(evt){
        // console.log(evt.deltaY)
        TweenMax.to(".cards",0.8,{
          left: "+="+evt.deltaY*2+"px"
        })
      },
      addCart(movie,evt,qty){
        if(isNaN(qty) || qty==0) return window.confirm("請輸入大於0的數");
        if(movie.qty+qty>movie.stock){
          // console.log(movie.qty,qty,movie.stock);
          return window.confirm("購買的數量已超過庫存")
        }
        this.currentMovie= movie
        let target = evt.target
        this.$nextTick(()=>{
          TweenMax.from(".buybox",0.8,{
            left: $(evt.target).offset().left,
            top: $(evt.target).offset().top,
            opacity:1
          })
          setTimeout(()=>{
            // if index == -1, 代表商品沒有加入購物車
            let index = this.cart.findIndex((item)=>{
              return movie.id == item.id
            })
            if(index == -1){
              this.cart.push(movie)    
              this.cart[this.cart.length-1].qty = qty;
              this.quantity += qty;
            }
            else{
              this.cart[index].qty += qty;
              this.quantity += qty;
            }
          },800)
  
        })      
      },
      deleteCart(movie) {
        // if index == -1, 代表商品沒有加入購物車
        let index = this.cart.findIndex((item)=>{
          return movie.id == item.id
        })
        if(index == -1){
          return;
        }
        else{
          this.quantity -= this.cart[index].qty;          ;
          this.cart[index].qty = 0;
          return this.cart.splice(index,1);
        }
      },
      cartMinus(movie){
        // if index == -1, 代表商品沒有加入購物車
        let index = this.cart.findIndex((item)=>{
          return movie.id == item.id
        })
        if(index == -1){
          return;
        }
        else{
          if(this.cart[index].qty-1 <1){
            this.cart[index].qty -= 1;
            this.quantity -=1;
            return this.cart.splice(index,1);
          }
          this.cart[index].qty -= 1;
          this.quantity -=1;
        } 
      },
      cartPlus(movie){
        // if index == -1, 代表商品沒有加入購物車
        let index = this.cart.findIndex((item)=>{
          return movie.id == item.id
        })
        if(index == -1){
          return;
        }
        else{
          if(movie.qty+1>movie.stock) return window.confirm("購買的數量已超過庫存") 
          this.cart[index].qty += 1;
          this.quantity +=1;
        } 
      },
      clearCart(){
        this.cart.forEach(movie => {
          movie.qty = 0;
        });
        this.cart = [];
        this.quantity = 0;
      },
    },
    computed:{
      totalPrice(){
        return this.cart
          .map(movie=>movie.price*movie.qty)
          .reduce((total,p)=>total+p,0)
      }
    },
    watch: {
      cart(){
        TweenMax.from(".fa-shopping-cart",0.3,{
          scale: 0.5
        })
      }
    }
  })