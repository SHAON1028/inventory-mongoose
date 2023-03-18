const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

// schema design
const productSchema  = mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please a Name for this product"],
    trim:true,
    unique:[true,"Name must be unique"],
    minLength:[3,"Name must be three characters"],
    maxLength:[100,"Name is too long"]

  },
  // name: {
  //   type: String,
  //   required: [true, "Please provide a name for this product."],
  //   trim: true,
  //   unique: [true, "Name must be unique"],
  //   minLength: [3, "Name must be at least 3 characters."],
  //   maxLenght: [100, "Name is too large"],
  // },
  description:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true,
    min:[0,"Price must be between 0 and up"]
  },
  unit: {
    type: String,
    required: true,
    enum: {
      values: ["kg", "litre", "pcs"],
      message: "unit value can't be {VALUE}, must be kg/litre/pcs"
    }
  },
  quantity:{
    type:Number,
    required:true,
    min:[0,"Quantity must be between 0 and up"],
    validate:{
      validator:(value)=>{
          const isInteger = Number.isInteger(value)
          if(isInteger){
            return true
          }
          else{
            return false
          }
      },
      message:"quantity must be an integer"
    }
  },
  status:{
    type:String,
    required:true,
    enum:{
     values: ["in-stock","out-of-stock","discontinued"],
     message:"Status can't be [VALUE]"
    }
  },
  // createdAt:{
  //   type:Date,
  //   default:Date.now
  // },
  // updatedAt:{
  //   type:Date,
  //   default:Date.now
  // }
  // supplier:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"Supplier",
  //   required:true
  // },
  // embedded schema
  categories:[{
    name:{
      type:String,
      required:true,
      
    },
    _id:mongoose.Schema.Types.ObjectId
  }]

},
{
  timestamps:true
})
// 

// middlewares for mongoose :pre, post
productSchema.pre('save',function(next){

  //this -> 
   console.log(' Before saving data');
     if (this.quantity == 0) {
      this.status = 'out-of-stock'
    }

   next()
 })
// jekono fuction inject korte pari
productSchema.methods.logger= function(){
  console.log(` Data saved for ${this.name}`);
}

//  productSchema.post('save',function(doc,next){
//   console.log('After saving data');

//   next()
// })
// Schema --> models --> Query

// model

const Product = mongoose.model("Product",productSchema)

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

app.post('/api/v1/product', async(req, res) => {
  try{
    //save
    // const product = new Product(req.body)
    // const result =await product.save()

    // create
    const result = await Product.create(req.body)
    result.logger()
  res.status(200).send({
    status:'success',
    message:"data saved successfully",
    data:result
  })
  }
  catch(error){
    res.status(400).send({
      status:'fail',
      message:"data not saved",
      error:error.message
    })
  }
})



module.exports = app;
