const Employer = require("../models/emplyer");
const Role = require("../models/role");
const EmployerRoles = require("../models/employesrole");
const ApiResponse = require("../configs/api_response");

// Fetch all employers with their roles
const fetchEmployersWithRoles = async (req, res) => {
  try {
    const employers = await Employer.findAll({
      include: {
        model: Role,
        through: { attributes: [] }, // Exclude junction table attributes
      },
    });
    return ApiResponse.success(res, { employers });
  } catch (error) {
    return ApiResponse.error(
      res,
      "Failed to retrieve employers with roles",
      error
    );
  }
};

const addEmployer = async (req, res) => {
  const { name, phone, password, rolesId } = req.body; // Extract data from request body
  try {
    // Create the employer
    const employer = await Employer.create({ name, phone, password });

    console.log("These are the role IDs: ", rolesId);

    if (rolesId && Array.isArray(rolesId)) {
      // Loop through rolesId and create entries in EmployerRoles
      for (const roleId of rolesId) {
        await EmployerRoles.create({
          EmployerId: employer.id,
          RoleId: roleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return ApiResponse.success(res, { employer });
  } catch (error) {
    console.error("Error adding employer:", error);
    return ApiResponse.error(res, "Failed to add employer", error);
  }
};

const updateEmployer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, password, rolesId } = req.body;

  try {
    // Find employer by ID
    const employer = await Employer.findByPk(id);

    if (!employer) {
      return ApiResponse.error(res, "Employer not found", 404);
    }

    // Update the employer details (name, phone, password)
    await employer.update({ name, phone, password });

    // Step 1: Check if roleIds are provided and are in an array
    if (rolesId && Array.isArray(rolesId)) {
      // Step 2: Get the current roles associated with the employer from the transition table
      const currentRoles = await EmployerRoles.findAll({
        where: {
          EmployerId: employer.id,
        },
      });

      // Step 3: Get the IDs of the current roles
      const currentRoleIds = currentRoles.map((role) => role.RoleId);

      // Step 4: Find the roles to add (roles that are in rolesId but not in currentRoleIds)
      const rolesToAdd = rolesId.filter(
        (roleId) => !currentRoleIds.includes(roleId)
      );

      // Step 5: Find the roles to remove (roles that are in currentRoleIds but not in rolesId)
      const rolesToRemove = currentRoleIds.filter(
        (roleId) => !rolesId.includes(roleId)
      );

      // Step 6: Add the new roles to the EmployerRoles table
      if (rolesToAdd.length > 0) {
        for (const roleId of rolesToAdd) {
          await EmployerRoles.create({
            EmployerId: employer.id,
            RoleId: roleId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Step 7: Remove the roles that are no longer associated with the employer
      if (rolesToRemove.length > 0) {
        for (const roleId of rolesToRemove) {
          await EmployerRoles.destroy({
            where: {
              EmployerId: employer.id,
              RoleId: roleId,
            },
          });
        }
      }

      console.log("Roles added:", rolesToAdd);
      console.log("Roles removed:", rolesToRemove);
    }

    return ApiResponse.success(res, { employer });
  } catch (error) {
    console.error("Failed to update employer:", error);
    return ApiResponse.error(res, "Failed to update employer", error);
  }
};

const removeEmployer = async (req, res) => {
  const { id } = req.params;
  try {
    const employer = await Employer.findByPk(id);

    if (!employer) {
      return ApiResponse.error(res, "Employer not found", 404);
    }

    await employer.destroy();
    return ApiResponse.success(res, {
      message: "Employer deleted successfully",
    });
  } catch (error) {
    return ApiResponse.error(res, "Failed to delete employer", error);
  }
};

// Fetch all roles
const fetchRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    return ApiResponse.success(res, { roles });
  } catch (error) {
    return ApiResponse.error(res, "Failed to retrieve roles", error);
  }
};

// Update roles for an employer
const updateEmployerRoles = async (req, res) => {
  const { employerId } = req.params;
  const { roleIds } = req.body;

  try {
    const employer = await Employer.findByPk(employerId);

    if (!employer) {
      return ApiResponse.error(res, "Employer not found", 404);
    }

    const roles = await Role.findAll({ where: { id: roleIds } });
    await employer.setRoles(roles);

    return ApiResponse.success(res, { employer });
  } catch (error) {
    return ApiResponse.error(res, "Failed to update employer's roles", error);
  }
};

module.exports = {
  fetchEmployersWithRoles,
  addEmployer,
  updateEmployer,
  removeEmployer,
  updateEmployerRoles,
  fetchRoles,
  updateEmployer,
};
