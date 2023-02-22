import { Object3D, Quaternion, Vector3 } from "three"

class GeometryUtils {
	static rotateAroundAxis(
		object: Object3D,
		axis: Vector3,
		angle: number = 0
	) {
		if (!(object instanceof Object3D)) {
			throw new Error(
				"Argument 'object' must be an instance of THREE.Object3D"
			)
		}

		let q = new Quaternion()
		q.setFromAxisAngle(axis, angle)

		object.applyQuaternion(q)
		object.position.applyQuaternion(q)
	}
}

export default GeometryUtils
