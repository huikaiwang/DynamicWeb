// Blocks
var blockdata=[
  {selector: ".block1", name: "1", pitch: "1"},
  {selector: ".block2", name: "2", pitch: "2"},
  {selector: ".block3", name: "3", pitch: "3"},
  {selector: ".block4", name: "4", pitch: "4"}
]

var soundsetdata =[
  {name: "correct", sets: [1,3,5,8]},
  {name: "wrong", sets: [2,4,5.5,7]}
]

//接著定義每個關卡的資料  放在最前面宣告的地方
var levelDatas = [
  "1234",
  "12324",
  "231234",
  "41233412",
  "232421234",
  "3434321222",
  "223322114231"    
]

var Blocks = function(blockAssign, setAssign){
  this.allOn = false
  this.blocks = blockAssign.map((d,i)=>({
    name: d.name,
    el: $(d.selector),
    audio: this.getAudioObject(d.pitch)
  }))
  this.soundSets = setAssign.map((d,i)=>({
    name: d.name,
    //把數字的陣列轉成聲音陣列
    sets: d.sets.map((pitch)=>this.getAudioObject(pitch))
  }))
}

Blocks.prototype.getAudioObject = function(pitch){
  return new Audio("https://awiclass.monoame.com/pianosound/set/"+pitch+".wav")
}

//接下來處理亮起來這件事情
Blocks.prototype.flash = function(note){
  //1.find blocks first
  let block = this.blocks.find(d=>d.name == note)
  if(block){
    //如果有找到這個 block 那我們希望他亮起來
    block.el.addClass("active") 
    //這樣做必須配合 CSS .blocks .block.block1:active 增加
    //, .blocks .block.block1.active
    setTimeout(()=>{
      if(this.allOn==false){
        block.el.removeClass("active")
      }
    },100)
  }
}

Blocks.prototype.turnAllOn = function(){
  this.allOn = true
  this.blocks.forEach((block)=>{
    block.el.addClass("active")
  })
}

Blocks.prototype.turnAllOff = function(){
  this.allOn = false
  this.blocks.forEach((block)=>{
    block.el.removeClass("active")
  })
}

Blocks.prototype.playSet = function(type){
  // find audio
  let sets = this.soundSets.find( set => set.name==type).sets
  sets.forEach((obj)=>{
    obj.currentTime=0
    obj.play()
  })
}

//記得要先 new 一個 Blocks 才可以使用喔 
var Game = function(){
  this.blocks = new Blocks(blockdata,soundsetdata)
  this.levels = levelDatas
  //目前的關卡
  this.currentLevel = 0
  //遊戲的時間
  this.playInterval = 400
  //遊戲狀態
  this.mode = "waiting"
}

Game.prototype.showStatus = function(tempString){
  $(".inputStatus").html("")
  this.answer.split("").forEach((d,i)=>{
    var circle = $("<div class='circle'></div>")
    if (i<tempString.length){
      circle.addClass("correct")
    }
    $(".inputStatus").append(circle)
  })
  
  if (tempString ==""){
    this.blocks.turnAllOff()
  }
  if (tempString == this.answer){
    $(".inputStatus").addClass("correct")
    setTimeout(()=>{
      this.blocks.turnAllOn()
      //將原本的 播放正確 在這個地方顯示 (將之前的移到此處)
      this.blocks.playSet("correct")
    },500)        
  }
  else{
    //使用者未輸入完整
    $(".inputStatus").removeClass("correct")
  }
  
  if (this.answer.indexOf(tempString)!=0){
    $(".inputStatus").addClass("wrong")
    setTimeout(()=>{
      this.blocks.turnAllOn()
      //一樣把撥放錯誤的聲音群組班到這邊
      this.blocks.playSet("wrong")
    },500)          
  }
  else{
    $(".inputStatus").removeClass("wrong")
  }
}

Game.prototype.startLevel = function(){
  //抓當下的 level 傳給使用者
  this.showMessage("Level "+this.currentLevel)
  let leveldata = this.levels[this.currentLevel]
  this.startGame(leveldata)
}

//在目前的畫面中呈現我們目前是在哪一個關卡
Game.prototype.showMessage = function(mes){
  console.log(mes)
  $(".status").text(mes)
}

Game.prototype.startGame = function(answer){
  this.mode = "gamePlay"
  //把輸入一個個的撥放 
  //1.先把它拆解開來 
  //console input: "1234".split("") ->拆解成1 2 3 4
  //console: var list="1234".split("")
  //list
  //list.shift() ,list 逐步的播放與清空
  //直到他成為空的就可以讓使用者輸入

  this.answer = answer
  //console.log(this.answer)
  let notes = this.answer.split("")

  this.showStatus("")
  this.timer = setInterval(()=>{
    let char = notes.shift()
    //看看是否有正確取出
    //console.log(char)
    this.playNote(char)
    // my add
    this.blocks.blocks[char-1].audio.play()
    // check finish playing
    if(notes.length==0){
      //關掉計時器
      clearInterval(this.timer)    
      console.log("audio play end")
      this.startUserInput()
    }
    
  },this.playInterval)  
}

//新增一個 playNote 播放聲音
Game.prototype.playNote = function(note){
  console.log(note)
  this.blocks.flash(note)
}

Game.prototype.startUserInput = function(){
  //暫存使用者輸入資料
  this.userInput = ""
  this.mode = "userInput"
}

Game.prototype.userSendInput = function(inputChar){
  if(this.mode=="userInput"){

    let tempString = this.userInput + inputChar
    //play user input notes
    // my add
    this.blocks.blocks[inputChar-1].audio.play()
    this.playNote(inputChar)
    this.showStatus(tempString)
    //檢查輸入的資料是否正確
    if(this.answer.indexOf(tempString)==0){
      console.log("good job")
      //若完全正確
      if(this.answer==tempString){
        this.blocks.playSet("correct")
        this.showMessage("Correct!")
        this.currentLevel+=1
        this.mode="waitng"
        setTimeout(()=>{
          this.startLevel()
        },1000)
        console.log("correct")
      }
    }
    else{
      console.log("wrong")
      // 錯誤時就回到 level 0
      this.blocks.playSet("wrong")
      this.showMessage("Wrong!")
      this.currentLevel=0
      this.mode="waiting"
      setTimeout(()=>{
        this.startLevel()
      },1000)
    }
    this.userInput+=inputChar
  }
}

//產生遊戲物件
var game = new Game()
//使用1234做為測試
//game.startGame("1234")