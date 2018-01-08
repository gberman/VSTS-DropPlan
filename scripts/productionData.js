window.ExtensionData = (function(){
    "use script";
    
    init();

    var VSS_Service, TFS_Wit_WebApi, TFS_Work, TFS_Wit_Services;

    return {
        getTeamDaysOff: GetTeamDaysOff,
        getTeamSettings: GetTeamSettings,
        getCapacities: GetCapacities,
        getTeamIteration: GetTeamIteration,
        getTeamFieldValues: GetTeamFieldValues,
        getBacklogConfigurations: GetBacklogConfigurations,

        DataService: GetDataService,
        Query: Query,
        getWorkItems: GetWorkItems,

        Options: {
            getWorkItems: {
                MAX_WORK_ITEMS_AT_ONCE: 200
            }
        }
    };

    function GetWorkItems(openWorkItems, start, end){
        var _witClient = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
        return _witClient.getWorkItems(openWorkItems.slice(start, end), undefined, undefined, 1);
    }
    function Query(query){
        var context    = VSS.getWebContext(),
        _witClient = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient),
            _projectId = context.project.id;
        return _witClient.queryByWiql(query, _projectId);
    }
    function GetTeamDaysOff(){
        var iterationId = VSS.getConfiguration().iterationId;
        var teamContext = getTeamContext();
        var workClient  = TFS_Work.getClient();
        return workClient.getTeamDaysOff(teamContext, iterationId);
    }
    function GetTeamSettings(){
        var teamContext = getTeamContext();
        var workClient  = TFS_Work.getClient();
        return workClient.getTeamSettings(teamContext);
    }
    function GetCapacities(){
        var iterationId = VSS.getConfiguration().iterationId;
        var teamContext = getTeamContext();
        var workClient  = TFS_Work.getClient();
        return workClient.getCapacities(teamContext, iterationId);
    }
    function GetTeamIteration(){
        var iterationId = VSS.getConfiguration().iterationId;
        var teamContext = getTeamContext();
        var workClient  = TFS_Work.getClient();
        return workClient.getTeamIteration(teamContext, iterationId);
    }
    function GetTeamFieldValues(){
        var teamContext = getTeamContext();
        var workClient  = TFS_Work.getClient();
        return workClient.getTeamFieldValues(teamContext);
    }
    
    function GetDataService(){
        return VSS.getService(VSS.ServiceIds.ExtensionData);
    }

    function GetBacklogConfigurations(){
        var teamContext = getTeamContext();
        return workClient.getBacklogConfigurations(teamContext);
    }
    function getTeamContext(){
        var context = VSS.getWebContext();
        return { projectId: context.project.id, teamId: context.team.id, project: "", team: "" };
    }

    function init(){
        VSS.require(["VSS/Service", "TFS/WorkItemTracking/RestClient", "TFS/Work/RestClient", "TFS/WorkItemTracking/Services"],
            function (VSS_Service, TFS_Wit_WebApi, TFS_Work, TFS_Wit_Services) {
                this.VSS_Service      = VSS_Service;
                this.TFS_Wit_WebApi   = TFS_Wit_WebApi;
                this.TFS_Work         = TFS_Work;
                this.TFS_Wit_Services = TFS_Wit_Services;
            }
        );
    }
})();