namespace SGLibCS.Utils.Environment;
using SysEnv = System.Environment;


public static class EnviromentVariablesMapper
{
    public static void MapVariables(Dictionary<string, string> mappings)
    {
        foreach(var kvp in mappings)
        {
            var env = SysEnv.GetEnvironmentVariable(kvp.Key);
            if (env is not null)
            {
                SysEnv.SetEnvironmentVariable(kvp.Value, env);
            }
        }
    }
}
