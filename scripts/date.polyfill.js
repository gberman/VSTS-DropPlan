if (!VSS)
    VSS = {};
if (!VSS.Core)
    VSS.Core = {};
if (!VSS.Core.convertValueToDisplayString)
    VSS.Core.convertValueToDisplayString = function (n,t){
        return typeof currentDate === "string" ? new Date(n).toDateString() : n.toDateString();
    };