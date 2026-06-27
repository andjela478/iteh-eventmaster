module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('events', 'short_description', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'title'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('events', 'short_description');
  }
};
