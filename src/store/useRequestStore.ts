import { create } from "zustand";


type Tab = {
    label: string,
    value: string,
}

type initalState = {
    selectedReq : any,
    currentTab: Tab,
    refreshRequest : boolean,
    allRequest : any[],
    adminRequests? : any[],
    departmentRequests? : any[],
    activeTab: string,
    
}

const initialValues : initalState = {
    selectedReq: {
        id: "",
        email: "",
        name: "",
        request: null
    },
    currentTab: {
        label: "",
        value: "",
    },
    refreshRequest : false,
    allRequest : [],
    adminRequests : [],
    departmentRequests : [],
    activeTab: ""
}

type StateActions = {
    updateSelectedReq: (value : any) => void;
    updateCurrentTab: (value : Tab) => void
    setAllRequests : (value : any) => void
    setRefresh: (value: boolean) => void
    resetSelected : ()=> void
    updateRefeachRequests : (value : boolean) => void
    setAdminRequests? : (value : any[]) => void
    setDepartmentRequests? : (value : any[]) => void
    setActiveTab : (value : string) => void
}

const useRequestStore = create<initalState & StateActions>((set) => ({
    ...initialValues,
    updateRefeachRequests: (value) => set((state) => ({ ...state, refeachRequests: value })),
    updateSelectedReq: (value) => set((state) => ({ ...state, selectedReq: value })),
    updateCurrentTab: (value) => set((state) => ({ ...state, currentTab: value })),
    setAllRequests: (value) => set((state) => ({ ...state, allRequest: value })),
    setAdminRequests: (value) => set((state) => ({ ...state, adminRequests: value })),
    setDepartmentRequests: (value) => set((state) => ({ ...state, departmentRequests: value })),
    setActiveTab: (value) => set((state) => ({...state , activeTab: value})),
    setRefresh: (value) => set((state) => ({...state , refreshRequest: value})),
    resetSelected: ()=> set((state)=> ({...state, chat : initialValues.selectedReq }))
})

)

export default useRequestStore