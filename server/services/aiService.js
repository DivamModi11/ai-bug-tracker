import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeBugWithAI = async (bug)=>{

try{
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model:"gemini-2.0-flash"
    });
    const prompt = `

Analyze this software bug.

Title:
${bug.title}

Description:
${bug.description}

Priority:
${bug.priority}

Status:
${bug.status}

Comments:
${
bug.comments
?.map(
(c)=>
`${c.user?.name}: ${c.text}`
)
.join("\n")
}

Return ONLY valid JSON.

{
"rootCause":"",
"suggestedFix":"",
"priority":"",
"complexity":""
}

`;

const result =
await model.generateContent(
prompt
);

const text =
result.response.text();

console.log(
"RAW AI:",
text
);

const cleaned =
text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

return JSON.parse(
cleaned
);

}
catch(err){

console.log(
"AI ERROR:",
err
);

return{

rootCause:
"AI generation failed",

suggestedFix:
"Please Try Again Later... AI Free Quota Exceeded",

priority:
"Medium",

complexity:
"Medium"

};

}

};