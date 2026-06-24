import sys
from omnivoice import OmniVoice

print(dir(OmniVoice))
import inspect
print(inspect.signature(OmniVoice.generate))
