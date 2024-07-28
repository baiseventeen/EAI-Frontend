import userApis from "@/apis/user";
import testApis from "@/apis/test";
import editorApis from "@/apis/editor";
import dictApis from "@/apis/dictionary";
import aiApis from "@/apis/ai";
import engagementApis from "@/apis/engagement";
import assignmentApis from "@/apis/assignment";
import courseApis from "@/apis/course";


const apis = {
    ...userApis,
    ...testApis,
    ...editorApis,
    ...engagementApis,
    ...aiApis,
    ...dictApis,
    ...assignmentApis,
    ...courseApis
}

// hook
const useApis = () => {
    return apis
}

export default useApis
