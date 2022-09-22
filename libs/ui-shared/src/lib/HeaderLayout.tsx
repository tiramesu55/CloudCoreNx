import {Header} from '@cloudcore/ui-shared'
interface headerProps {
    title: string;
    signOut: () => void;
    children: React.ReactNode,
  }
 export const HeaderLayout = (props: headerProps ) => {
    return(
        <>
        <Header title={props.title} signOut={props.signOut} />
            {props.children}
        </>
    )
}
