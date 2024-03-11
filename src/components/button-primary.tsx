import Button from "./button";

export default function ButtonPrimary(props : any){
    return <Button  {...props} className={`bg-[#364e9a] border-2 h-4 border-white`}>{props.children}</Button>
}