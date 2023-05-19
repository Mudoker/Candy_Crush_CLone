import Button from "./button";

export default function ButtonPrimary(props : any){
    return <Button  {...props} className={`bg-orange-600 border-white`}>{props.children}</Button>
}