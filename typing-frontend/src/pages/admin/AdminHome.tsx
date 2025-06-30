import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"


function AdminHome() {
  return (
    <div>
      <Link to="/admin/products">
        <Button variant="primary">Manage products</Button>
      </Link>
      <Link to="/admin/add-product">
        <Button variant="primary">Add product</Button>
      </Link>
      <Link to="/admin/categories">
        <Button variant="success">Manage categories</Button>
      </Link>
      <Link to="/admin/add-category">
      <Button variant="warning">Add category</Button>
      </Link>
    </div>
  )
}

export default AdminHome