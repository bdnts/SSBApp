﻿// these functions are in the global scope for brevity. Implement your own encapsulation.

function createGanttWidget(container, ganttId) {
	if (!ensureKendoAndJquery()) { return; }

	// create the jQuery widgets here
	createGantt($(container).find("#" + ganttId));
}

function destroyGanttWidget(container) {
	if (!ensureKendoAndJquery()) { return; }

	// dispose the Kendo widgets in the container to avoid memory leaks when Blazor removes their DOM elements
	// if you have your own jQuery events attached, detach them here as well
	kendo.destroy(container);
	// if you have issues with Blazor not clearing all the DOM generated through jQuery, you may need to do it yourself
	// for example, widgets generating popup elements outside of the current container may remain in the DOM and
	// you may need to remove them yourself (e.g., before destroying the Kendo widgets, so you can use the references they offer)
	// $(container).find("#" + ganttId).empty();
}

function ensureKendoAndJquery() {
	if (!window.$ || !window.kendo) {
		alert("something went wrong with loading the Kendo library, review the script references");
		// implement your own preferred error handling and/or CDN fallback
		return false;
	}
	return true;
}

function createGantt(elem) {
	var serviceRoot = "https://demos.telerik.com/kendo-ui/service";
	elem.kendoGantt({
		dataSource: new kendo.data.GanttDataSource({
			transport: {
				read: {
					url: serviceRoot + "/GanttTasks",
					dataType: "jsonp"
				},
				update: {
					url: serviceRoot + "/GanttTasks/Update",
					dataType: "jsonp"
				},
				destroy: {
					url: serviceRoot + "/GanttTasks/Destroy",
					dataType: "jsonp"
				},
				create: {
					url: serviceRoot + "/GanttTasks/Create",
					dataType: "jsonp"
				},
				parameterMap: function (options, operation) {
					if (operation !== "read") {
						return { models: kendo.stringify(options.models || [options]) };
					}
				}
			},
			schema: {
				model: {
					id: "id",
					fields: {
						id: { from: "ID", type: "number" },
						orderId: { from: "OrderID", type: "number", validation: { required: true } },
						parentId: { from: "ParentID", type: "number", defaultValue: null, validation: { required: true } },
						start: { from: "Start", type: "date" },
						end: { from: "End", type: "date" },
						title: { from: "Title", defaultValue: "", type: "string" },
						percentComplete: { from: "PercentComplete", type: "number" },
						summary: { from: "Summary", type: "boolean" },
						expanded: { from: "Expanded", type: "boolean", defaultValue: true }
					}
				}
			}
		}),
		dependencies: new kendo.data.GanttDependencyDataSource({
			transport: {
				read: {
					url: serviceRoot + "/GanttDependencies",
					dataType: "jsonp"
				},
				update: {
					url: serviceRoot + "/GanttDependencies/Update",
					dataType: "jsonp"
				},
				destroy: {
					url: serviceRoot + "/GanttDependencies/Destroy",
					dataType: "jsonp"
				},
				create: {
					url: serviceRoot + "/GanttDependencies/Create",
					dataType: "jsonp"
				},
				parameterMap: function (options, operation) {
					if (operation !== "read") {
						return { models: kendo.stringify(options.models || [options]) };
					}
				}
			},
			schema: {
				model: {
					id: "id",
					fields: {
						id: { from: "ID", type: "number" },
						predecessorId: { from: "PredecessorID", type: "number" },
						successorId: { from: "SuccessorID", type: "number" },
						type: { from: "Type", type: "number" }
					}
				}
			}
		}),
		views: [
			"day",
			{ type: "week", selected: true },
			"month"
		],
		columns: [
			{ field: "id", title: "ID", width: 60 },
			{ field: "title", title: "Title", editable: true, sortable: true },
			{ field: "start", title: "Start Time", format: "{0:MM/dd/yyyy}", width: 100, editable: true, sortable: true },
			{ field: "end", title: "End Time", format: "{0:MM/dd/yyyy}", width: 100, editable: true, sortable: true }
		],
		height: 700,

		showWorkHours: false,
		showWorkDays: false,

		snap: false
	});
}
