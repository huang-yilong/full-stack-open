const Notification = ({ info }) => {
  if (!info || !info.message) {
    return null
  }

  return <div className={info.type}>{info.message}</div>
}

export default Notification
