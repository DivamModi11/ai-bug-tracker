import mongoose from "mongoose";

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      default:null
     },
     comments:[
      {
          user:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"User"
          },
          text:{
              type:String,
              required:true
          },
          createdAt:{
              type:Date,
              default:Date.now
          }
      }
      ]
  },
  {
    timestamps: true,
  }
);

const Bug = mongoose.model("Bug", bugSchema);

export default Bug;