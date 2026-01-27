<%@ WebHandler Language="C#" Class="SaveIncident" %>

using System;
using System.Web;
using System.IO;

public class SaveIncident : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";
        
        // Only allow POST requests
        if (context.Request.HttpMethod != "POST")
        {
            context.Response.StatusCode = 405;
            context.Response.Write("{\"success\":false,\"error\":\"Method not allowed\"}");
            return;
        }
        
        try
        {
            // Read the JSON from the request body
            string json;
            using (StreamReader reader = new StreamReader(context.Request.InputStream))
            {
                json = reader.ReadToEnd();
            }
            
            // Basic validation - make sure it's valid JSON array
            if (string.IsNullOrWhiteSpace(json))
            {
                context.Response.StatusCode = 400;
                context.Response.Write("{\"success\":false,\"error\":\"Empty request body\"}");
                return;
            }
            
            // Try to parse to validate it's proper JSON
            try
            {
                // Simple check - should start with [ and end with ]
                json = json.Trim();
                if (!json.StartsWith("[") || !json.EndsWith("]"))
                {
                    throw new Exception("JSON must be an array");
                }
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;
                context.Response.Write("{\"success\":false,\"error\":\"Invalid JSON: " + ex.Message.Replace("\"", "'") + "\"}");
                return;
            }
            
            // Path to the public incident.json in readylpc folder
            string targetPath = context.Server.MapPath("~/readylpc/incident.json");
            
            // Create backup before overwriting
            string backupFolder = context.Server.MapPath("~/readylpc/staff/backups");
            if (!Directory.Exists(backupFolder))
            {
                Directory.CreateDirectory(backupFolder);
            }
            
            if (File.Exists(targetPath))
            {
                string backupPath = Path.Combine(backupFolder, 
                    "incident_" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".json");
                File.Copy(targetPath, backupPath);
            }
            
            // Write the new JSON
            File.WriteAllText(targetPath, json);
            
            context.Response.Write("{\"success\":true,\"message\":\"Saved successfully\",\"timestamp\":\"" + 
                DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "\"}");
        }
        catch (UnauthorizedAccessException)
        {
            context.Response.StatusCode = 403;
            context.Response.Write("{\"success\":false,\"error\":\"Permission denied - check file permissions\"}");
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.Write("{\"success\":false,\"error\":\"" + ex.Message.Replace("\"", "'") + "\"}");
        }
    }
    
    public bool IsReusable
    {
        get { return false; }
    }
}
