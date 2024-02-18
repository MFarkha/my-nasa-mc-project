import { withStyles } from "arwes";
// import withStyles from 'react-jss'

const styles = () => ({
  root: {
    margin: "0 auto",
    maxWidth: 800,
  },
  "@media (max-width: 800px)": {
    root: {
      margin: "0 12px",
    }
  }
});

const Centered = props => {
  const {
    classes,
    className,
    children,
    ...rest
  } = props;
  return (
    <div className={`${classes.root} ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default withStyles(styles)(Centered);
