import Link from "next/link"

export default function Button(props : any){
    const className = `m-auto border-4 rounded-full p-2 md:p-5 text-xl md:text-3xl font-bold min-w-[8rem] md:min-w-[12rem] text-center ${props.className}`
    return (
        props.href ? 
        <Link {...props} className={className} href={props.href}>{props.children}</Link> :
        <button {...props} className={className}>{props.children}</button>
    )
}