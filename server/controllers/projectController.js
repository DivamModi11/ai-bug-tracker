import Project from "../models/Project.js";
import Bug from "../models/Bug.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "createdBy",
      "name email"
    );

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProject = async (req,res)=>{
  try{
    const projectId = req.params.id;
    await Bug.deleteMany(
      { projectId}
    );
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({
      message: "Project deleted"
    });
  }
  catch(err){
    res.status(500).json({
      message: err.message
    });
  }
};
export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    // avoid duplicate members
    if (project.members.includes(userId)) {
      return res.status(400).json({
        message: "User already added"
      });
    }

    project.members.push(userId);

    await project.save();

    res.status(200).json({
      message: "Member added",
      project
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


export const getProjectById = async (req,res)=>{
  try{
 
    const project =
    await Project.findById(
      req.params.id
    )
    .populate(
      "createdBy",
      "name email"
    )
    .populate(
      "members",
      "name email"
    );
 
    res.status(200).json(project);
 
  }
  catch(err){
 
    res.status(500).json({
      message:err.message
    });
 
  }
 };
