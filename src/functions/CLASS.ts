import ClassValidator from "../validators/ClassValidator"

/**
 * Checks if next parameter is an instance of the class passed here
 */
export default <T extends new () => any>(clazz: T) => {
	return new ClassValidator(clazz)
}
