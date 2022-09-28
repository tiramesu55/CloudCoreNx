import {Header} from '@cloudcore/ui-shared'
interface headerProps {
    title: string;
    signOut: () => void;
    children:any,
    menuComponent?: any
}

export const HeaderLayout = (props: headerProps ) => {
    return(
        <>
        <Header title={props.title} signOut={props.signOut} menuComponent={props.menuComponent}/>
            {props.children}
        </>
    )
}
