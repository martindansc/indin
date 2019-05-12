import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

def generate_model():

   section = ctrl.Antecedent(np.arange(0, 2, 1), 'section')
   section.automf(3)
   velocity = ctrl.Antecedent(np.arange(0, 2, 1), 'velocity')
   velocity.automf(3)
   locality = ctrl.Antecedent(np.arange(1, 4, 1), 'locality')
   locality.automf(3)
   time = ctrl.Antecedent(np.arange(0, 6, 1), 'time')
   time.automf(3)

   # output variable
   needs_help = ctrl.Consequent(np.arange(0, 100, 1), 'needs_help')
   needs_help['low'] = fuzz.trimf(needs_help.universe, [0, 0, 50])
   needs_help['medium'] = fuzz.trimf(needs_help.universe, [0, 50, 100])
   needs_help['high'] = fuzz.trimf(needs_help.universe, [50, 100, 100])

   rules = []

   rules.append(ctrl.Rule(section['poor'] & velocity['poor'], needs_help['high']))
   rules.append(ctrl.Rule(section['poor'] & velocity['average'], needs_help['high']))
   rules.append(ctrl.Rule(section['good'] & velocity['poor'], needs_help['medium']))

   rules.append(ctrl.Rule(locality['poor'] & velocity['good'], needs_help['medium']))
   rules.append(ctrl.Rule(locality['good'] & velocity['poor'], needs_help['high']))

   rules.append(ctrl.Rule(locality['average'], needs_help['low']))
   rules.append(ctrl.Rule(locality['poor'], needs_help['medium']))
   
   rules.append(ctrl.Rule(time['poor'], needs_help['low']))

   rules.append(ctrl.Rule(locality['poor'], needs_help['medium']))
   rules.append(ctrl.Rule(locality['average'], needs_help['low']))
   rules.append(ctrl.Rule(locality['good'], needs_help['high']))

   return ctrl.ControlSystem(rules)

def predict(section, velocity, locality, time):
   simulation = ctrl.ControlSystemSimulation(model)
   simulation.input['section'] = section
   simulation.input['velocity'] = velocity
   simulation.input['locality'] = locality
   simulation.input['time'] = time

   simulation.compute()

   return simulation.output['needs_help']

def execute(gender, section, time, distance, area):
   input_section = 0
   if((gender == "Male" and section == "Male") or (gender == "Female" and section == "Female")):
      input_section = 2
   elif(section == "Child"):
      input_section = 1

   locality = distance/area
   velocity = distance/time

   return predict(input_section, velocity, locality, time)

model = generate_model()