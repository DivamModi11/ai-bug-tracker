import Project from "../models/Project.js";
import Bug from "../models/Bug.js";

export const getDashboardStats =
async (req, res) => {

try {

const totalProjects =
await Project.countDocuments();

const totalBugs =
await Bug.countDocuments();

const openBugs =
await Bug.countDocuments({
status:"Open"
});

const progressBugs =
await Bug.countDocuments({
status:"In Progress"
});

const resolvedBugs =
await Bug.countDocuments({
status:"Resolved"
});

res.status(200).json({

totalProjects,

totalBugs,

openBugs,

progressBugs,

resolvedBugs,

});

}

catch(err){

res.status(500).json({
message:
err.message
});

}

};