import Bug from "../models/Bug.js";
import { analyzeBugWithAI } from "../services/aiService.js";

export const createBug = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      projectId,
      assignedTo
    } = req.body;

    const bug = await Bug.create({
      title,
      description,
      priority,
      projectId,
      createdBy: req.user.id,
      assignedTo,
    });

    res.status(201).json(bug);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getProjectBugs =async (req,res)=>{
  try{
    const {status,priority,search} = req.query;
    const filter = {
      projectId: req.params.projectId
    };
    if(status){
      filter.status = status;
    }
    if(priority){
      filter.priority = priority;
    }
    if(search){
      filter.title = {
        $regex:search,
        $options:"i"
      };
    }
    const bugs = await Bug.find(filter).populate(
      "assignedTo",
      "name email"
    )
    .populate(
      "comments.user",
      "name"
    );
    res.status(200).json(bugs);
  }
  catch(err){
    res.status(500).json({
      message: err.message
    });
  }
};

export const updateBugStatus = async (
    req,
    res
  ) => {
    try {
  
      const { status } =
        req.body;
  
      const bug =
        await Bug.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
          }
        );
  
      res.status(200)
        .json(bug);
  
    } catch (err) {
  
      res.status(500)
        .json({
          message:
            err.message,
        });
  
    }
  };

  export const deleteBug = async (req,res)=>{
    try{
      await Bug.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message:"Bug deleted"
      });
    }
    catch(err){
      res.status(500).json({
        message: err.message
      });
    }
  };

  export const addComment = async (req, res) => {
    try {
    
    const { bugId } = req.params;
    const { text } = req.body;
    
    if (!text) {
    return res.status(400).json({
    message: "Comment is required"
    });
    }
    
    const bug = await Bug.findById(bugId);
    
    if (!bug) {
    return res.status(404).json({
    message: "Bug not found"
    });
    }
    
    bug.comments.push({
    user: req.user.id,
    text
    });
    
    await bug.save();
    
    const updatedBug = await Bug.findById(bugId)
    .populate("comments.user", "name email");
    
    res.status(200).json(updatedBug);
    
    } catch (error) {
    
    res.status(500).json({
    message: error.message
    });
    
    }
    };

    export const analyzeBug = async (req,res)=>{
      try{
        const { bugId }=req.params;
        const bug= await Bug.findById(bugId)
        .populate(
          "assignedTo",
          "name"
        )
        .populate(
          "comments.user",
          "name"
        );
        
        if(!bug){
          return res.status(404).json({
          message:"Bug not found"
        });
      
      }
      const analysis = await analyzeBugWithAI(bug);
      
      res.status(200).json({

        title:bug.title,
        
        description:bug.description,
        
        analysis
        
        });
  }
  catch(err){
    res.status(500).json({
      message:err.message
    });
  }
};



  