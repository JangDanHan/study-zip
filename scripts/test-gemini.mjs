import fs from "fs"

async function testGemini() {
  const envContent = fs.readFileSync(".env", "utf-8")
  const keyMatch = envContent.match(/GEMINI_API_KEY=(.*)/)
  const apiKey = keyMatch ? keyMatch[1].trim() : ""

  console.log("Testing with gemini-3.6-flash / gemini-3.7-flash...")

  const models = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-2.5-flash", "gemini-1.5-pro"]
  
  for (const model of models) {
    try {
      console.log(`\nChecking model: ${model}...`)
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Respond in JSON: {\"status\": \"ok\", \"model\": \"" + model + "\"}" }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      )
      
      const data = await res.json()
      if (res.ok) {
        console.log(`🎉 [${model}] SUCCESS! Response:`, data.candidates?.[0]?.content?.parts?.[0]?.text)
        return model
      } else {
        console.log(`⚠️ [${model}] Status ${res.status}:`, data.error?.message)
      }
    } catch (err) {
      console.error(`❌ [${model}] Error:`, err.message)
    }
  }
}

testGemini()
