import {Header} from '@cloudcore/ui-shared'
interface headerProps {
    title: string;
    signOut: () => void;
    children: JSX.Element,
  }
 export const HeaderLayout = (props: headerProps ) => {
    return(
        <>
        <Header title={props.title} signOut={props.signOut} />
            {props.children}
        </>
    )
}
